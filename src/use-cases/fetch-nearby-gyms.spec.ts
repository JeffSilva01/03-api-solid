import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoreGymsRepository } from '@/repositories/in-memore/in-memore-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoreGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoreGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Java Script',
      phone: '85999999999',
      latitude: -3.7429479,
      longitude: -38.6147046,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Java Script',
      phone: '85999999999',
      latitude: -3.8805131,
      longitude: -38.4875665,
    })

    const { gyms } = await sut.execute({
      userLatitude: -3.7429479,
      userLongitude: -38.6147046,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
