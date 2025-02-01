import { FastifyInstance } from 'fastify'
import { createTransactionSchema } from '../validations/transactions/create'
import { knex } from '../database'
import crypto from 'node:crypto'
import { TRANSACTION_TYPE } from '../utils/enums'
import { findByIdSchema } from '../validations/transactions/listById'
import { deleteByIdSchema } from '../validations/transactions/deleteById'

export async function transactionsRoutes(app: FastifyInstance) {
  //* List all transactions
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return { transactions }
  })

  //* List transaction by id
  app.get('/:id', async (request, reply) => {
    const routeParamsValidated = findByIdSchema.safeParse(request.params)

    if (!routeParamsValidated.success) {
      return reply.status(400).send({
        message: 'Invalid id',
        errors: routeParamsValidated.error.flatten().fieldErrors,
      })
    }

    const { id } = routeParamsValidated.data

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  //* List the balance
  app.get('/balance', async () => {
    const balance = await knex('transactions')
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

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount,
      created_at: new Date().toISOString(),
    })

    return reply.status(201).send()
  })

  // * Delete transaction by id
  app.delete('/:id', async (request, reply) => {
    const routeParamsValidated = deleteByIdSchema.safeParse(request.params)

    if (!routeParamsValidated.success) {
      return reply.status(400).send({
        message: 'Invalid id',
        errors: routeParamsValidated.error.flatten().fieldErrors,
      })
    }

    const { id } = routeParamsValidated.data

    await knex('transactions').where('id', id).delete()

    reply.status(204).send()
  })

  // * Delete all transactions
  app.delete('/', async (_, reply) => {
    await knex('transactions').delete()

    reply.status(204).send()
  })
}
