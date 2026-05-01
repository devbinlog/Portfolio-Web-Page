import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>).message || 'Internal server error'
        : exception instanceof Error
          ? exception.message
          : 'Internal server error'

    const details =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      Array.isArray((exceptionResponse as Record<string, unknown>).message)
        ? (exceptionResponse as Record<string, unknown>).message
        : undefined

    const isProduction = process.env.NODE_ENV === 'production'

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status] || 'UNKNOWN',
      message: Array.isArray(message) ? message[0] : message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(isProduction ? {} : { stack: exception instanceof Error ? exception.stack : undefined }),
    })
  }
}
