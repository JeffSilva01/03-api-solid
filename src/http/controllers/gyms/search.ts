import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, replay: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymsBodySchema.parse(request.body)

  const createGymUseCase = makeSearchGymsUseCase()

  const gym = await createGymUseCase.execute({
    page,
    query,
  })

  return replay.status(200).send({ gym })
}
