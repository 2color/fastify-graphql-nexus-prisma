import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify'
import mercurius from 'mercurius'
import { schema } from './schema'
import AltairFastify from 'altair-fastify-plugin'
import { context } from './context'
import shutdownPlugin from './plugins/shutdown'
import sentryPlugin from './plugins/sentry'
import dotenv from 'dotenv'

dotenv.config()

export function createServer(opts: FastifyServerOptions = {}) {
  const server = fastify(opts)

  server.register(shutdownPlugin)
  server.register(sentryPlugin)
  server.register(mercurius, {
    schema,
    path: '/graphql',
    graphiql: false,
    context: (request: FastifyRequest, reply: FastifyReply) => {
      return context
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

  // Status/health endpoint
  server.get(`/`, async function (req, res) {
    return { up: true }
  })

  return server
}

export async function startServer() {
  const server = createServer({
    logger: {
      level: 'info',
    },
  })

  try {
    const port = process.env.PORT ?? 3000
    await server.listen(port, '0.0.0.0')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
