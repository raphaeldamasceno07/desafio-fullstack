import fastitfyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
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
import { sessionRoutes } from './http/routes/authenticate'
import { userRoutes } from './http/routes/userRoutes'
import { customTransform } from './lib/custom-trasnform'
import { AppError } from './use-cases/errors/app-error'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

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

app.register(userRoutes)
app.register(sessionRoutes)

app.register(fastitfyCookie)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (error.validation) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }

  if (error instanceof AppError) {
    if (env.NODE_ENV !== 'prod') {
      console.warn(`⚠️ [Business Error]: ${error.message}`)
    }

    return reply.status(error.statusCode).send({
      message: error.message,
    })
  }

  if (env.NODE_ENV !== 'prod') {
    console.error('❌ [Internal Error]:', error)
  } else {
    // TODO: Integrate with an error tracking service like Sentry or LogRocket
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})
