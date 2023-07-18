import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create check in (e2e)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const responseCreateGym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '00999999999',
        latitude: '-3.7429479',
        longitude: '-38.6147046',
      })

    const response = await request(app.server)
      .post(`/gyms/${responseCreateGym.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: '-3.7429479',
        longitude: '-38.6147046',
      })

    expect(response.status).toEqual(201)
  })
})
