import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    }),
  );
  await app.listen(process.env.PORT, process.env.HOST_NAME);
  Logger.verbose(
    `app listening on  ${process.env.HOST_NAME}:${process.env.PORT}`,
  );
}
bootstrap();
