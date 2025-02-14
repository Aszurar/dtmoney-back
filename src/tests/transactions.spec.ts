import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import { execSync } from 'node:child_process'

beforeAll(() => {
  app.ready()
})

afterAll(() => {
  app.close()
})

beforeEach(() => {
  execSync('pnpm knex migrate:rollback --all')
  execSync('pnpm knex migrate:latest')
})


const newTransaction = {
  debit: {
    title: 'New transaction',
    amount: 5000,
    type: 'debit'
  },
  credit: {
    title: 'New transaction',
    amount: 2000,
    type: 'credit'
  }
} as const


describe('Transactions', () => {

  it('should be possible the user create a new transaction', async () => {
    // 1. lógica de teste
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit'
    })
    // 2. retornará algum resultado
    // console.log("StatusCode:", response.statusCode)
    // 3. Devemos validar esse resultado
    expect(response.statusCode).toBe(201)
  })

  it('should be possible the user list all transactions', async () => {


    const transaction = {
      title: 'New transaction',
      amount: 5000,
      type: 'credit'
    }

    const transactionCreated = await request(app.server).post('/transactions').send(transaction)

    // console.log("headers:", transactionCreated.headers)

    const response = await request(app.server).get('/transactions').set('Cookie', transactionCreated.headers['set-cookie'])

    // console.log("Body:", response.body)

    expect(response.statusCode).toBe(200)
    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        title: transaction.title,
        amount: transaction.amount
      })
    ])
  })

  it('should be possible the user list a specific transaction by id', async () => {

    const transaction = {
      title: 'New transaction',
      amount: 5000,
      type: 'credit'
    }

    // Create a transaction
    const transactionCreated = await request(app.server).post('/transactions').send(transaction)
    const sessionIdCookie = transactionCreated.headers['set-cookie']

    // List all transactions, will have only one transaction, the above created
    const listAllTransactions = await request(app.server).get('/transactions').set('Cookie', sessionIdCookie)
    // Get the id of the transaction created
    const transactionCreatedId = listAllTransactions.body.transactions[0].id

    // List a specific transaction by id
    const response = await request(app.server).get(`/transactions/${transactionCreatedId}`).set('Cookie', sessionIdCookie)


    expect(response.statusCode).toBe(200)
    expect(response.body.transaction).toEqual(
      expect.objectContaining({
        title: transaction.title,
        amount: transaction.amount
      })
    )
  })

  it('should be possible the user create a credit and debit transaction and get the balance', async () => {
    // Create transactions in different users
    const createDebitResponse = await request(app.server).post('/transactions').send(newTransaction.debit)
    const createCreditResponse = await request(app.server).post('/transactions').send(newTransaction.credit)

    // Get the session id of the transactions
    const debitTransactionSessionIdCookie = createDebitResponse.headers['set-cookie']
    const creditTransactionSessionIdCookie = createCreditResponse.headers['set-cookie']

    // get the balance of the transactions
    const debitBalanceResponse = await request(app.server).get('/transactions/balance').set('Cookie', debitTransactionSessionIdCookie)
    const creditBalanceResponse = await request(app.server).get('/transactions/balance').set('Cookie', creditTransactionSessionIdCookie)

    // Validate the balance
    expect(debitBalanceResponse.statusCode).toBe(200)
    expect(debitBalanceResponse.body.balance.amount).toBe(-newTransaction.debit.amount)

    expect(creditBalanceResponse.statusCode).toBe(200)
    expect(creditBalanceResponse.body.balance.amount).toBe(newTransaction.credit.amount)
  })

  it('should be possible the user delete all transactions', async () => {

    // Create transactions in different users
    const debitTransactionCreated = await request(app.server).post('/transactions').send(newTransaction.debit)
    const creditTransactionCreated = await request(app.server).post('/transactions').send(newTransaction.credit)

    // Get the session id of the transactions
    const debitTransactionSessionIdCookie = debitTransactionCreated.headers['set-cookie']
    const creditTransactionSessionIdCookie = creditTransactionCreated.headers['set-cookie']

    // Delete all transactions in different users
    await request(app.server).delete('/transactions').set('Cookie', debitTransactionSessionIdCookie)
    await request(app.server).delete('/transactions').set('Cookie', creditTransactionSessionIdCookie)

    // List all transactions in different users
    const listAllDebitTransactions = await request(app.server).get('/transactions').set('Cookie', debitTransactionSessionIdCookie)
    const listAllCreditTransactions = await request(app.server).get('/transactions').set('Cookie', creditTransactionSessionIdCookie)

    // Validate the transactions
    expect(listAllDebitTransactions.body.transactions).toEqual([])
    expect(listAllCreditTransactions.body.transactions).toEqual([])
  })

  it('should be possible the user delete a specific transaction by id', async () => {
    // Create transactions in different users
    const debitTransactionCreated = await request(app.server).post('/transactions').send(newTransaction.debit)
    const creditTransactionCreated = await request(app.server).post('/transactions').send(newTransaction.credit)

    // Get the session id of the transactions
    const debitTransactionSessionIdCookie = debitTransactionCreated.headers['set-cookie']
    const creditTransactionSessionIdCookie = creditTransactionCreated.headers['set-cookie']

    // List all transactions in different users
    const listAllDebitTransactions = await request(app.server).get('/transactions').set('Cookie', debitTransactionSessionIdCookie)
    const listAllCreditTransactions = await request(app.server).get('/transactions').set('Cookie', creditTransactionSessionIdCookie)

    // Get the id of the transactions created
    const debitTransactionCreatedId = listAllDebitTransactions.body.transactions[0].id
    const creditTransactionCreatedId = listAllCreditTransactions.body.transactions[0].id

    // Delete a specific transaction by id in different users
    await request(app.server).delete(`/transactions/${debitTransactionCreatedId}`).set('Cookie', debitTransactionSessionIdCookie)
    await request(app.server).delete(`/transactions/${creditTransactionCreatedId}`).set('Cookie', creditTransactionSessionIdCookie)

    // List all transactions in different users
    const listAllDebitTransactionsAfterDelete = await request(app.server).get('/transactions').set('Cookie', debitTransactionSessionIdCookie)
    const listAllCreditTransactionsAfterDelete = await request(app.server).get('/transactions').set('Cookie', creditTransactionSessionIdCookie)

    // Validate the transactions
    expect(listAllDebitTransactionsAfterDelete.body.transactions).toEqual([])
    expect(listAllCreditTransactionsAfterDelete.body.transactions).toEqual([])
  })

})