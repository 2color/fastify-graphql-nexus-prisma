import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify'
import { tracingIgnoreRoutes } from './constants'
import mercurius from 'mercurius'
import { schema } from './schema'
import AltairFastify from 'altair-fastify-plugin'
import shutdownPlugin from './plugins/shutdown'
import openTelemetryPlugin from '@autotelic/fastify-opentelemetry'
import prismaPlugin from './plugins/prisma'
import { Context } from './context'
import statusPlugin from './plugins/status'

require('./opentelemetry')
export function createServer(opts: FastifyServerOptions = {}) {
  const server = fastify(opts)

  server.register(shutdownPlugin)
  server.register(openTelemetryPlugin, {
    serviceName: process.env.SERVICE_NAME,
    wrapRoutes: true,
    ignoreRoutes: tracingIgnoreRoutes,
  })
  server.register(statusPlugin)
  server.register(prismaPlugin)

  server.register(mercurius, {
    schema,
    path: '/graphql',
    graphiql: false,
    context: (request: FastifyRequest, reply: FastifyReply): Context => {
      return {
        prisma: server.prisma,
        request,
        reply,
      }
    },
  })
  server.register(AltairFastify, {
    path: '/altair',
    baseURL: '/altair/',
    // 'endpointURL' should be the same as the mercurius 'path'
    endpointURL: '/graphql',
    initialSettings: {
      theme: 'dark',
      plugin: {
        list: ['altair-graphql-plugin-graphql-explorer'],
      },
    },
  })

  return server
}

export async function startServer() {
  const server = createServer({
    logger: {
      level: 'info',
    },
    disableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'true'
  })

  try {
    const port = process.env.PORT ?? 3000
    await server.listen(port, '0.0.0.0')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
