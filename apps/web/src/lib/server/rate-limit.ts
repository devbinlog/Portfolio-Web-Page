import { prisma } from './prisma'

const LOGIN_FAIL_MAX = 5
const LOGIN_LOCK_MINUTES = 15

export async function checkLoginLock(email: string): Promise<void> {
  const admin = await prisma.adminUser.findUnique({
    where: { email },
    select: { loginFailCount: true, loginLockedUntil: true },
  })
  if (!admin) return

  if (admin.loginLockedUntil && admin.loginLockedUntil > new Date()) {
    throw new Error('RATE_LIMITED')
  }

  if (admin.loginFailCount >= LOGIN_FAIL_MAX) {
    // lock not yet set but count exceeded — set it now
    const lockedUntil = new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000)
    await prisma.adminUser.update({
      where: { email },
      data: { loginLockedUntil: lockedUntil },
    })
    throw new Error('RATE_LIMITED')
  }
}

export async function incrementLoginFail(email: string): Promise<void> {
  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin) return

  const newCount = admin.loginFailCount + 1
  const lockedUntil =
    newCount >= LOGIN_FAIL_MAX
      ? new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000)
      : admin.loginLockedUntil

  await prisma.adminUser.update({
    where: { email },
    data: { loginFailCount: newCount, loginLockedUntil: lockedUntil },
  })
}

export async function resetLoginFail(email: string): Promise<void> {
  await prisma.adminUser.update({
    where: { email },
    data: { loginFailCount: 0, loginLockedUntil: null },
  })
}

const CONTACT_RATE_LIMIT_MAX = 5
const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1시간

export async function checkContactRateLimit(ip: string): Promise<void> {
  const since = new Date(Date.now() - CONTACT_RATE_LIMIT_WINDOW_MS)
  const count = await prisma.contactMessage.count({
    where: {
      ipAddress: ip,
      createdAt: { gte: since },
    },
  })

  if (count >= CONTACT_RATE_LIMIT_MAX) {
    throw new Error('RATE_LIMITED')
  }
}
