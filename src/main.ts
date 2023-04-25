import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MissingParamsFilter } from './shared/exceptions/missing.params.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
