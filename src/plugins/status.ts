import { FastifyPluginAsync } from 'fastify'

const statusPlugin: FastifyPluginAsync = async (server, options) => {
  // Status/health endpoint
  server.get(`/`, async function (req, res) {
    return { up: true }
  })
}

export default statusPlugin
