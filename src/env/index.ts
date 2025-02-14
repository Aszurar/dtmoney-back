import { config } from 'dotenv'
import { z } from 'zod'
import { Environment, EnvironmentFilesName } from './environments'

if (process.env.NODE_ENV === Environment.TEST) {
  config({
    path: EnvironmentFilesName.TEST,
  })
} else {
  config()
}

console.log("process.env.DATABASE_URL", process.env.DATABASE_URL)

const envSchema = z.object({
  NODE_ENV: z
    .enum([Environment.DEV, Environment.TEST, Environment.PRODUCTION], {
      message: 'Invalid NODE_ENV',
    })
    .default(Environment.DEV),
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL env is required',
  }).trim().min(1),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {

  const skipLine = '\n'
  const title = `❌ Check your envs file - Environment variables validation failed ${skipLine}`

  const description = _env.error.errors
    .map((error, index) => `${index} - ${error.message}`)
    .join(`${skipLine}${skipLine}`) + skipLine

  const errorMessage = title + description

  throw new Error(errorMessage)
}

export const env = _env.data
