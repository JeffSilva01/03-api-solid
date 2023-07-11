import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'

export class InMemoreGymsRepository implements GymsRepository {
  private itens: Gym[] = []

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
