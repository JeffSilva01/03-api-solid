import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export const app = fastify()

app.post('/users', async (request, reply) => {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return reply.status(201).send()
})
