import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser middleware
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: [ 'http://127.0.0.1:5500', 
      'http://127.0.0.1:62213']
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
