import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoreGymsRepository } from '@/repositories/in-memore/in-memore-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoreGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to check in', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: 'Java Script',
      phone: '85999999999',
      latitude: -3.7429479,
      longitude: -38.6147046,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
