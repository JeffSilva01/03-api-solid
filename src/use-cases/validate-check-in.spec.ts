import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoreCheckInsRepository } from '@/repositories/in-memore/in-memore-check-ins-repository'
import { ValidateCheckInsCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoreCheckInsRepository
let sut: ValidateCheckInsCase

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoreCheckInsRepository()
    sut = new ValidateCheckInsCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const TWENTY_ONE_MINUTES_IN_MILLISECONDS = 1000 * 60 * 21

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MILLISECONDS)

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
