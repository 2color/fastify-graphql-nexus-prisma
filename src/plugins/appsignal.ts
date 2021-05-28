import { Appsignal } from '@appsignal/nodejs'
import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { NodeClient, NodeSpan } from '@appsignal/types'


declare module 'fastify' {
  interface FastifyInstance {
    appsignal: NodeClient
  }
  interface FastifyRequest {
    span: NodeSpan
  }
}
const appsignal = new Appsignal({
  active: true,
  name: 'fastly',
  apiKey: process.env.APPSIGNAL_PUSH_API_KEY,
  debug: true,
  logPath: "logs"
})
const appSignalPlugin: FastifyPluginAsync = fp(async (server, options) => {
  appsignal.start()

  server.decorate('appsignal', appsignal)

  const tracer = appsignal.tracer()
  const meter = appsignal.metrics()

  // Declare request span in request object https://www.fastify.io/docs/latest/Decorators/#decoraterequestname-value-dependencies
  server.decorateRequest('span', null)

  server.addHook('onRequest', (req, res, next) => {
    meter.incrementCounter('request_count', 1)
    if(req.routerPath === '/graphql') {
      req.span = tracer.currentSpan().setName(`[unknown graphql query]`)
    }
    next()
  })

  server.graphql.addHook('preExecution', async (schema, document, context) => {
    context.reply.request.span
      // @ts-ignore because operation is not guaranteed to be there
      .setName(document.definitions[0]?.operation)
      .child()
      .setCategory("execute.graphql")
      .setName("GraphQL | Execute")
      // .set("appsignal:body", request.query ?? "")

  })

  server.graphql.addHook('onResolution', async (execution, context) => {
    context.reply.request.span.close()
  })
})

export default appSignalPlugin
