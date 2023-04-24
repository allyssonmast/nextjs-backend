import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit/rabbit.service';

@Module({
  providers: [RabbitService]
})
export class RabbitmqModule {}
