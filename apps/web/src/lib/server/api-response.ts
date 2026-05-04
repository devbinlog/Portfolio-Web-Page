import { NextResponse } from 'next/server'

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}

export function apiError(message: string, status = 500): NextResponse {
  return NextResponse.json({ message }, { status })
}
