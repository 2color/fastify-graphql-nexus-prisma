import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const prisma = new PrismaClient({
    log: ['error', 'info', 'warn'],
  })

  await prisma.$connect()

  server.decorate('prisma', prisma)

  // // Middleware function to track db query performance
  // prisma.$use(async (params, next) => {
  //   const transaction = Sentry.startTransaction({
  //     op: `${params.model}.${params.action}`,
  //     name: 'Prisma DB query',
  //   })
  //   const result = await next(params)
  //   transaction.finish()

  //   return result
  // })
})

export default prismaPlugin
