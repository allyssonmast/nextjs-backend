import { Module } from '@nestjs/common';
import { RabbitMQConfig } from './config/rabbit.config';
import { RabbitMQService } from './rabbitMQ.service';

@Module({
  providers: [RabbitMQService, RabbitMQConfig],
})
export class RabbitmqModule {}
