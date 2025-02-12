import { FastifyInstance } from 'fastify'
import { createTransactionSchema } from '../validations/transactions/create'
import { knex } from '../database'
import crypto from 'node:crypto'
import { TRANSACTION_TYPE } from '../utils/enums'
import { findByIdSchema } from '../validations/transactions/listById'
import { deleteByIdSchema } from '../validations/transactions/deleteById'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  //* List all transactions
  app.get('/',
    {
      preHandler: [checkSessionIdExists],

    }
    , async (request) => {
      const sessionId = request.cookies.sessionId

      const transactions = await knex('transactions').where('session_id', sessionId).select('*')

      return { transactions }
    })

  //* List transaction by id
  app.get('/:id',
    {
      preHandler: [checkSessionIdExists]
    }
    , async (request, reply) => {

      const sessionId = request.cookies.sessionId


      const routeParamsValidated = findByIdSchema.safeParse(request.params)

      if (!routeParamsValidated.success) {
        return reply.status(400).send({
          message: 'Invalid id',
          errors: routeParamsValidated.error.flatten().fieldErrors,
        })
      }


      const { id } = routeParamsValidated.data

      const transaction = await knex('transactions').where('id', id).where('session_id', sessionId).first()

      return { transaction }
    })

  //* List the balance
  app.get('/balance',
    {
      preHandler: [checkSessionIdExists]
    }
    , async (request) => {

      const sessionId = request.cookies.sessionId

      const balance = await knex('transactions').where('session_id', sessionId)
        .sum('amount', {
          as: 'amount',
        })
        .first()

      return { balance }
    })

  //* Create a transaction
  app.post('/', async (request, reply) => {
    const data = request.body

    const dataValidated = createTransactionSchema.safeParse(data)

    if (!dataValidated.success) {
      return reply.status(400).send({
        message: 'Invalid data, please, filled correctly',
        errors: dataValidated.error.flatten().fieldErrors,
      })
    }

    const dataParsed = {
      ...dataValidated.data,
      amount:
        dataValidated.data.type === TRANSACTION_TYPE.CREDIT
          ? dataValidated.data.amount
          : dataValidated.data.amount * -1,
    }

    const { title, amount } = dataParsed


    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount,
      created_at: new Date().toISOString(),
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  // * Delete transaction by id
  app.delete('/:id',
    {
      preHandler: [checkSessionIdExists]
    }
    , async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const routeParamsValidated = deleteByIdSchema.safeParse(request.params)

      if (!routeParamsValidated.success) {
        return reply.status(400).send({
          message: 'Invalid id',
          errors: routeParamsValidated.error.flatten().fieldErrors,
        })
      }

      const { id } = routeParamsValidated.data

      await knex('transactions').where('id', id).where('session_id', sessionId).delete()

      reply.status(204).send()
    })

  // * Delete all transactions
  app.delete('/',
    {
      preHandler: [checkSessionIdExists]
    }
    , async (request, reply) => {
      const sessionId = request.cookies.sessionId

      await knex('transactions').where("session_id", sessionId).delete()

      reply.status(204).send()
    })
}
