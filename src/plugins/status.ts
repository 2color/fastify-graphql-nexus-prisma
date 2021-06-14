import { FastifyPluginAsync } from 'fastify'

const statusPlugin: FastifyPluginAsync = async (server, options) => {
  // Status/health endpoint
  server.get(`/`, async function (req, res) {
    const { tracer, activeSpan } = req.openTelemetry()
    // console.log(activeSpan)
    // Spans started in a wrapped route will automatically be children of the activeSpan.
    const childSpan = tracer.startSpan(`artificial delay`)
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500)
    })
    childSpan.end()

    return { up: true }
  })
}

export default statusPlugin
