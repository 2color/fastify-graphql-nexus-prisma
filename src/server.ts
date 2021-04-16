import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify'
import mercurius from 'mercurius'
import { schema } from './schema'
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
    context: (request: FastifyRequest, reply: FastifyReply) => {
      return context
    },
    graphiql: true,
  })

  server.get(`/`, async function (req, res) {
    // Status endpoint
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
