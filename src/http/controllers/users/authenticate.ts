import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await replay.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return replay.status(200).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return replay.status(400).send({ error: error.message })
    }
    throw error
  }
}
