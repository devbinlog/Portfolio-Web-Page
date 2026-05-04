export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
  details?: { field: string; message: string }[]
  timestamp: string
  path: string
}

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error'
  timestamp: string
  uptime?: number
  services: {
    database: 'ok' | 'error'
  }
}

export interface ContactFormPayload {
  name: string
  email: string
  message: string
}

export interface AdminLoginPayload {
  email: string
  password: string
}

export interface AdminTokenResponse {
  accessToken: string
  expiresIn: number
}
