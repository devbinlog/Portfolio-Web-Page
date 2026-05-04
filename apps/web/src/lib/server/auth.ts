import { SignJWT, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
)

export interface JwtPayload {
  sub: string
  email: string
  role: string
}

export async function signJwt(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET)
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as unknown as JwtPayload
}

export async function verifyAuth(req: NextRequest): Promise<JwtPayload> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED')
  }
  const token = authHeader.slice(7)
  return verifyJwt(token)
}
