import { Knex, knex as setupKnex } from 'knex'
import { env } from './env'
import { DATABASE_CLIENT } from './env/environments'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === DATABASE_CLIENT.POSTGRES ? env.DATABASE_URL : {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
