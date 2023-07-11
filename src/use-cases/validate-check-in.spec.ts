import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoreCheckInsRepository } from '@/repositories/in-memore/in-memore-check-ins-repository'
import { ValidateCheckInsCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoreCheckInsRepository
let sut: ValidateCheckInsCase

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoreCheckInsRepository()
    sut = new ValidateCheckInsCase(checkInsRepository)
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent the check-in', async () => {
    await expect(
      sut.execute({
        checkInId: 'id-not-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
