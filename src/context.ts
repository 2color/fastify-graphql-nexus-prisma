import { PrismaClient } from '@prisma/client'
import * as Sentry from '@sentry/node'

export interface Context {
  prisma: PrismaClient
}

const prisma = new PrismaClient({
  log: ['error', 'info', 'warn'],
})

// Middleware function to track db query performance
prisma.$use(async (params, next) => {
  const transaction = Sentry.startTransaction({
    op: `${params.model}.${params.action}`,
    name: 'Prisma DB query',
  })
  const result = await next(params)
  transaction.finish()

  return result
})

export const context: Context = {
  prisma: prisma,
}
