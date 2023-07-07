import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoreUsersRepository implements UsersRepository {
  private itens: User[] = []

  async findById(id: string) {
    const user = this.itens.find((user) => user.id === id)

    return user || null
  }

  async findByEmail(email: string) {
    const user = this.itens.find((user) => user.email === email)

    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
    }

    this.itens.push(user)

    return user
  }
}
