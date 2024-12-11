import 'dotenv/config'
import { z } from 'zod'

enum Environment {
  TEST = 'test',
  DEV = 'development',
  PRODUCTION = 'production',
}

const envSchema = z.object({
  NODE_ENV: z
    .enum([Environment.DEV, Environment.TEST, Environment.PRODUCTION])
    .default(Environment.DEV),
  DATABASE_URL: z.string().trim().min(1),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
