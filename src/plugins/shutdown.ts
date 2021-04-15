import { FastifyPluginAsync } from 'fastify'

const shutdownPlugin: FastifyPluginAsync = async (server, options) => {
  process.on('SIGINT', () => server.close())
  process.on('SIGTERM', () => server.close())
}

export default shutdownPlugin
