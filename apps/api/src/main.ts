import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  })

  // 전역 접두사
  app.setGlobalPrefix('api/v1')

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  // 전역 유효성 검증 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // 전역 예외 필터
  app.useGlobalFilters(new HttpExceptionFilter())

  // 전역 인터셉터
  app.useGlobalInterceptors(new LoggingInterceptor())

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`API server running on port ${port}`)
}

bootstrap()
