import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoreGymsRepository implements GymsRepository {
  private itens: Gym[] = []

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = this.itens.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )
      return distance < 10
    })

    return gyms
  }

  async searchMany(query: string, page: number = 1) {
    const gyms = this.itens
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async findById(id: String) {
    const gym = this.itens.find((gym) => gym.id === id)

    return gym || null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title ?? null,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.itens.push(gym)

    return gym
  }
}
