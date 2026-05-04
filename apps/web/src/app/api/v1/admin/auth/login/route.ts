import type { NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/server/prisma'
import { signJwt } from '@/lib/server/auth'
import { checkLoginLock, incrementLoginFail, resetLoginFail } from '@/lib/server/rate-limit'
import { ok, apiError } from '@/lib/server/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return apiError('email과 password는 필수입니다.', 400)
    }

    await checkLoginLock(email)

    const admin = await prisma.adminUser.findUnique({ where: { email } })

    if (!admin || !admin.isActive) {
      await incrementLoginFail(email)
      return apiError('이메일 또는 비밀번호가 올바르지 않습니다.', 401)
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash)
    if (!isValid) {
      await incrementLoginFail(email)
      return apiError('이메일 또는 비밀번호가 올바르지 않습니다.', 401)
    }

    await resetLoginFail(email)
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    const accessToken = await signJwt({ sub: admin.id, email: admin.email, role: admin.role })

    return ok({ accessToken, expiresIn: 3600 })
  } catch (e) {
    if (e instanceof Error && e.message === 'RATE_LIMITED') {
      return apiError('로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.', 429)
    }
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
