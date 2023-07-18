import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, replay: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { sub, role } = request.user

  const token = await replay.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub,
      },
    },
  )

  const refreshToken = await replay.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub,
        expiresIn: '7d',
      },
    },
  )

  return replay
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
