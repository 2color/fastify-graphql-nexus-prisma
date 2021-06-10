import { PrismaClient } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify';

export interface Context {
  prisma: PrismaClient
  request: FastifyRequest, 
  reply: FastifyReply
}