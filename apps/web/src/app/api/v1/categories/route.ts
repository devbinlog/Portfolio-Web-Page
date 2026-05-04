import { prisma } from '@/lib/server/prisma'
import { ok, apiError } from '@/lib/server/api-response'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    })
    return ok(categories)
  } catch (e) {
    console.error(e)
    return apiError('서버 오류가 발생했습니다.')
  }
}
