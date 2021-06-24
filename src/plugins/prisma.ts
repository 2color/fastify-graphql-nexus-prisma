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
    log: ['error', 'warn'],
  })

  await prisma.$connect()

  server.decorate('prisma', prisma)

  server.addHook('onClose', async (server) => {
    server.log.info('disconnecting Prisma from DB')
    await server.prisma.$disconnect()
  })

  // // Middleware function to track db query performance
  // prisma.$use(async (params, next) => {
  //   const result = await next(params)
  //   return result
  // })
})

export default prismaPlugin
