import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MissingParamsFilter } from './utils/errors/missing.params.error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new MissingParamsFilter());
  await app.listen(3000);
}
bootstrap();
