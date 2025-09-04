import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- 1. IMPORTAR ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. AÑADIR ESTA LÍNEA
  // Activa la validación automática para todos los DTOs en todos los endpoints.
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001, '0.0.0.0');
}
bootstrap();