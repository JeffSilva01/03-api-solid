import { describe, it, expect, beforeEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoreCheckIns } from '@/repositories/in-memore/in-memore-check-ins'

let usersRepository: InMemoreCheckIns
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoreCheckIns()
    sut = new CheckInUseCase(usersRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gyn-01',
      userId: 'user-01',
    })

    expect(checkIn.gym_id).toEqual(expect.any(String))
  })
})
