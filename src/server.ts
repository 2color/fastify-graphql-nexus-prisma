import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { context } from './context'
import dotenv from 'dotenv'
import { createApolloPlugin } from '@appsignal/apollo-server'
import { Appsignal } from '@appsignal/nodejs'

dotenv.config()

const appsignal = new Appsignal({
  active: true,
  debug: true,
})


const server = new ApolloServer({
  schema: schema,
  context: context,
  plugins: [createApolloPlugin(appsignal)],
})

export async function startServer() {
  const { url } = await server.listen()
  console.log(`🚀 Server ready at: ${url}`)
}
