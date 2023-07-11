import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  findById(id: String): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
}
