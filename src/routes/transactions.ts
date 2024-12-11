import { FastifyInstance } from 'fastify'
import knex from 'knex'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // await knex('transactions').insert({
    //   amou
    // })
  })
}
