import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:8081',  // 허용할 도메인
      methods: 'GET,POST,PATCH,PUT,DELETE',           // 허용할 HTTP 메서드
      allowedHeaders: 'Content-Type,Authorization',  // 허용할 헤더
    },
  });
  await app.listen(3000);
}
bootstrap();
