import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoreCheckInsRepository } from '@/repositories/in-memore/in-memore-check-ins-repository'
import { InMemoreGymsRepository } from '@/repositories/in-memore/in-memore-gyms-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let usersRepository: InMemoreCheckInsRepository
let gymsRepository: GymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoreCheckInsRepository()
    gymsRepository = new InMemoreGymsRepository()
    sut = new CheckInUseCase(usersRepository, gymsRepository)

    gymsRepository.create({
      id: 'gyn-01',
      title: 'JavaScript Gym',
      description: 'Java Script',
      phone: '85999999999',
      latitude: -3.7429479,
      longitude: -38.6147046,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gyn-01',
      userId: 'user-01',
      userLatitude: -3.7429479,
      userLongitude: -38.6147046,
    })

    expect(checkIn.gym_id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gyn-01',
      userId: 'user-01',
      userLatitude: -3.7429479,
      userLongitude: -38.6147046,
    })

    await expect(
      sut.execute({
        gymId: 'gyn-01',
        userId: 'user-01',
        userLatitude: -3.7429479,
        userLongitude: -38.6147046,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gyn-01',
      userId: 'user-01',
      userLatitude: -3.7429479,
      userLongitude: -38.6147046,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gyn-01',
      userId: 'user-01',
      userLatitude: -3.7429479,
      userLongitude: -38.6147046,
    })

    await expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: 'gyn-02',
      title: 'JavaScript Gym',
      description: 'Java Script',
      phone: '85999999999',
      latitude: -3.744312,
      longitude: -38.613664,
    })

    await expect(
      sut.execute({
        gymId: 'gyn-02',
        userId: 'user-01',
        userLatitude: -3.7429479,
        userLongitude: -38.6147046,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
