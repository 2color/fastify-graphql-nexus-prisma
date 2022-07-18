# GraphQL Server with Fastify, Mercurius, Prisma, and Nexus Example

## ⚠️ Warning! 

This repository is **no longer maintained** and some of the packages may be out of date.

Nonetheless, there are two patterns in here that I think are still really useful for anyone building a GraphQL API:
- Code-first GraphQL schema construction. I still think this is the way to go if you like type safety and TypeScript. I would probably switch Nexus and nexus-prisma for [**Pothos**](https://pothos-graphql.dev/). You can learn about this Pothos in [this talk from the Pothos creator](https://www.youtube.com/watch?v=LqKPfMmxFxw). The main benefit I see of Pothos over Nexus is simplicity and more active development.
- Observability & Tracing: having visibility into the health of your GraphQL API is essential, as I demo in [this talk](https://www.youtube.com/watch?v=H9P2rrQJEts). 


## Intro


This repo shows how to build a GraphQL server with TypeScript and the following technologies:

- [**Fastify**](https://www.fastify.io/): Fast and low overhead web framework, for Node.js
- [**Mercurius**](https://mercurius.dev/): GraphQL adapter for Fastify
- [**Nexus**](https://nexusjs.org/): Declarative, Code-First GraphQL Schemas for JavaScript/TypeScript
- [**nexus-prisma**](https://github.com/prisma/nexus-prisma/): Plugin that allows projecting types from your Prisma schema to the GraphQL schema
- [**Prisma**](https://www.prisma.io/): Next-generation ORM for type-safe interaction with the database
- [**PostgreSQL**](https://www.postgresql.org/): powerful, open source object-relational database system with over 30 years of active development.
<!-- - [**Sentry**](https://sentry.io/): an error tracking and monitoring tool. -->
- [**OpenTelemetry Tracing**](https://opentelemetry.io/): An observability framework for cloud-native software. Configured to trace HTTP requests, GraphQL resolution and Prisma queries.
- [**Altair GraphQL**](https://altair.sirmuel.design/): GraphQL Web Client (similar to GraphQL Playground and Gr)

The project is written in TypeScript and attempts to maintain a high degree of type-safety by leveraging Prisma and GraphQL.

Play with a deployed version of this API: https://fastify-prisma.up.railway.app/altair

## Deploy it! 🚢

[![Deploy on Railway 🚊](https://railway.app/button.svg)](https://railway.app/new?template=https%3A%2F%2Fgithub.com%2F2color%2Ffastify-graphql-nexus-prisma&plugins=postgresql&envs=SENTRY_DSN&optionalEnvs=SENTRY_DSN)


## DB Schema

The database schema is defined using the [Prisma schema](./prisma/schema.prisma) which defines 3 models:
- User
- Post
- Comment


## GraphQL schema

The GraphQL schema is defined with Nexus using the [code-first approach](https://www.prisma.io/blog/the-problems-of-schema-first-graphql-development-x1mn4cb0tyl3).

The relevant files are:
- [./src/schema.ts](./src/schema.ts): Source of truth for the schema in TypeScript
- [./schema.graphql](./schema.graphql): Generated GraphQL scehma

## Getting started

### Prerequisites 
- A PostgreSQL DB

### Steps

1. clone repo
2. create `.env` file and define `DATABASE_URL` and `SENTRY_DSN`
3. `npm install`
4. `npm run migrate:dev` to run shcema migrations with [Prisma Migrate](https://www.prisma.io/migrate)
5. `npm run dev` to start dev server and run the API

## Tracing

The GraphQL server is instrumented with OpenTelemetry tracing.

Here's how it works:
- `@autorelic/fastify-opentelemetry` is a plugin that creates a root span for every fastify HTTP request and allows creating child spans using `request.openTelemetry()`
-  `@opentelemetry/instrumentation-graphql` provides auto-instrumentation for GraphQL execution
- Additional spans for Prisma Client queries are created in the GraphQL resolvers through `context.request.openTelemetry()`.


### Example trace

![trace example](https://user-images.githubusercontent.com/1992255/123289101-6c69d400-d510-11eb-9154-8aa0bdb8d10c.png)


### Viewing traces in local development with Jaeger

You can view traces in local development using [Jaeger](https://www.jaegertracing.io/).

1. Start jaeger by going into the [tracing](./tracing) folder and running `docker compose up -d`
2. In your `.env` file set `JAEGER_EXPORTER="true"`
3. Open the Jaeger UI: `http://localhost:16686/`
