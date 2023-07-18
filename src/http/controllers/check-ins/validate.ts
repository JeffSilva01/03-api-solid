import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeValidateCheckInsUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, replay: FastifyReply) {
  const validateCheckInsParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInsParamsSchema.parse(request.params)

  try {
    const validateCheckInsUseCase = makeValidateCheckInsUseCase()

    await validateCheckInsUseCase.execute({
      checkInId,
    })

    return replay.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return replay.status(404).send({ error: error.message })
    }

    if (error instanceof LateCheckInValidationError) {
      return replay.status(400).send({ error: error.message })
    }

    throw error
  }
}
