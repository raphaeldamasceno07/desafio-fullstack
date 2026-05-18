import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import scalarApiReference from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'
import { env } from './env'
import { customTransform } from './lib/custom-trasnform'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: '*',
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Desafio full stack',
      description: 'API para o desafio full stack da CUBOS',
      version: '1.0.0',
    },
  },
  transform: customTransform,
})

app.register(scalarApiReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
    layout: 'modern',
    showSiderbar: true,
  },
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'validation error.',
      issues: error.format(),
    })
  }
  if (env.NODE_ENV !== 'prod') {
    console.error(error)
  } else {
    // TODO We should log the error to an external service like Sentry or DataDog
  }

  return reply.status(500).send({
    message: 'internal server error.',
  })
})
