import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/', async () => {
  const results = await knex('sqlite_schema').select('*')

  return results
})

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('🚀 Server is running on port 3000')
  })
