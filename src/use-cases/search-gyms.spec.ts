import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoreGymsRepository } from '@/repositories/in-memore/in-memore-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoreGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoreGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'Java Script',
      phone: '85999999999',
      latitude: -3.7429479,
      longitude: -38.6147046,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: 'Java Script',
      phone: '85999999999',
      latitude: -3.7429479,
      longitude: -38.6147046,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: 'Java Script',
        phone: '85999999999',
        latitude: -3.7429479,
        longitude: -38.6147046,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
