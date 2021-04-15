import { PrismaClient } from '@prisma/client'

export interface Context {
  prisma: PrismaClient
}

const prisma = new PrismaClient({
  log: ['error', 'info', 'warn']
})

export const context: Context = {
  prisma: prisma,
}
