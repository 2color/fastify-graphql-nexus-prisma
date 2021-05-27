import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import * as fastify from 'fastify'
import * as http from 'http'

declare module 'fastify' {
  export interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const prisma = new PrismaClient({
    log: ['error', 'info', 'warn'],
  })

  server.decorate('prisma', prisma)
})

export default prismaPlugin

