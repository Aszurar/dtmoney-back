import { z } from 'zod'
import { TRANSACTION_TYPE } from '../../utils/enums'

const createTransactionSchema = z.object({
  title: z.string().trim().min(1).max(255),
  amount: z.number(),
  type: z.enum([TRANSACTION_TYPE.CREDIT, TRANSACTION_TYPE.DEBIT]),
})

export { createTransactionSchema }
