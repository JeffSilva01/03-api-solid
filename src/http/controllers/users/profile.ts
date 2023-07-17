import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, replay: FastifyReply) {
  const userId = request.user.sub

  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({ userId })

  return replay
    .status(200)
    .send({ user: { ...user, password_hash: undefined } })
}
