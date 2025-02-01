import { z } from 'zod'

const findByIdSchema = z.object({
  id: z.string().uuid(),
})

export { findByIdSchema }
