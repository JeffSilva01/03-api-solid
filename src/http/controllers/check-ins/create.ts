import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeCheckInsUseCase } from '@/use-cases/factories/make-check-ins-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, replay: FastifyReply) {
  const checkInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  const { gymId } = checkInsParamsSchema.parse(request.params)
  const userId = request.user.sub

  try {
    const checkInsUseCase = makeCheckInsUseCase()

    await checkInsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
      gymId,
      userId,
    })

    return replay.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return replay.status(404).send({ error: error.message })
    }

    if (error instanceof MaxDistanceError) {
      return replay.status(400).send({ error: error.message })
    }

    if (error instanceof MaxNumberOfCheckInsError) {
      return replay.status(400).send({ error: error.message })
    }

    throw error
  }
}
