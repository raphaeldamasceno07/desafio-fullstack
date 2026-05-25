import { prisma } from '@/lib/prisma'
import { makeCreateMovieUseCase } from '@/use-cases/factories/make-create-movie-use-case'
import { createMovieBodySchema } from '@movie-challenge/core-types'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function createMovie(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.isMultipart()) {
    return reply
      .status(400)
      .send({ message: 'Request must be multipart/form-data' })
  }

  const data = await request.file()
  if (!data) {
    return reply.status(400).send({ message: 'Missing movie poster file' })
  }

  const fields = data.fields as any
  const fileBuffer = await data.toBuffer()

  const rawMovieData = {
    title: fields.title?.value,
    original_title: fields.original_title?.value || fields.title?.value,
    description: fields.description?.value,
    duration: fields.duration?.value,
    release_date: fields.release_date?.value,
    budget: fields.budget?.value,
    genre: fields.genre?.value,
    popularity: fields.popularity?.value,
    vote_count: fields.vote_count?.value,
    rating: fields.rating?.value,
    status: fields.status?.value,
    language: fields.language?.value,
    revenue: fields.revenue?.value,
  }

  let validatedData
  try {
    validatedData = createMovieBodySchema.parse(rawMovieData)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.log(
        '❌ ERRO DE VALIDAÇÃO DO ZOD DIRETOR:',
        JSON.stringify(error.format(), null, 2),
      )
    }
    throw error
  }

  const user = await prisma.user.findUnique({
    where: { id: request.user.sub },
    select: { email: true },
  })

  if (!user) {
    return reply.status(404).send({ message: 'User not found' })
  }

  const createMovieUseCase = makeCreateMovieUseCase()

  const { movie } = await createMovieUseCase.execute({
    userId: request.user.sub,
    userEmail: user.email,
    title: validatedData.title,
    original_title: validatedData.original_title || validatedData.title,
    description: validatedData.description,
    duration: Number(validatedData.duration),
    release_date: validatedData.release_date || new Date().toISOString(),
    budget: Number(validatedData.budget || 0),
    genre: validatedData.genre || '',
    file: {
      name: data.filename,
      buffer: fileBuffer,
      mimeType: data.mimetype,
    },
    popularity: validatedData.popularity,
    vote_count: validatedData.vote_count,
    rating: validatedData.rating,
    status: validatedData.status,
    language: validatedData.language,
    revenue: validatedData.revenue,
  })

  return reply.status(201).send({
    movie: {
      ...movie,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    },
  })
}
