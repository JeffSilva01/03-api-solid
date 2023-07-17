import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, replay: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().email().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  })

  const { title, description, latitude, longitude, phone } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  const gym = await createGymUseCase.execute({
    title,
    description,
    latitude,
    longitude,
    phone,
  })

  return replay.status(200).send({ gym })
}
