import { FastifyPluginAsync } from 'fastify'

const shutdownPlugin: FastifyPluginAsync = async (server, options) => {
  const close = async () => {
    await server.prisma.$disconnect()
    server.appsignal.stop()
    server.close()
  }
  process.on('SIGINT', close)
  process.on('SIGTERM', close)
}

export default shutdownPlugin
