import { Prisma, User } from '@prisma/client'
import { usersRepository } from '../users-repository'

export class InMemoreUsersRepository implements usersRepository {
  private users: User[] = []

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      ...data,
      id: 'user-01',
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
