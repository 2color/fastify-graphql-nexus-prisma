import { HttpTraceContextPropagator } from '@opentelemetry/core'
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks'
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector'
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql'
import { Resource } from '@opentelemetry/resources';


import { NodeTracerProvider } from '@opentelemetry/node'

import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanExporter,
} from '@opentelemetry/tracing'

const provider = new NodeTracerProvider({
  resource: new Resource({
    'service.name': process.env.SERVICE_NAME || 'fastify-graphql-nexus-prisma',
    'service.commit': process.env.RAILWAY_GIT_COMMIT_SHA as string || 'dev'
  }),
})

const graphQLInstrumentation = new GraphQLInstrumentation()
graphQLInstrumentation.setTracerProvider(provider)
graphQLInstrumentation.enable()

if (process.env.LIGHTSTEP_EXPORTER === 'true') {
  console.log(
    `Lightstep exporter enabled`,
  )
  provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new CollectorTraceExporter({
        url: 'https://ingest.lightstep.com:443/api/v2/otel/trace',
        headers: {
          'Lightstep-Access-Token': process.env.LS_ACCESS_TOKEN,
        },
      }),
    ),
  )
}

if (process.env.JAEGER_EXPORTER === 'true') {
  console.log(
    `Jaeger exporter enabled`,
  )
  const { JaegerExporter } = require('@opentelemetry/exporter-jaeger')
  const exporter = provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new JaegerExporter({
        serviceName: process.env.SERVICE_NAME || 'fastify-graphql-nexus-prisma',
        endpoint: 'http://localhost:14268/api/traces',
      }),
    ),
  )
}

// Emits traces to the console for debugging
// provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))

provider.register({
  contextManager: new AsyncHooksContextManager().enable(),
  propagator: new HttpTraceContextPropagator(),
})

export default provider
