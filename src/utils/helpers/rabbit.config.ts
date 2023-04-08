import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQConfig {
  url: string;
  queueName: string;
  login: string;
  password: string;

  constructor() {
    this.url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    this.queueName = process.env.RABBITMQ_QUEUE_NAME || 'notifications';
    this.login = process.env.RABBITMQ_USERNAME || 'guest';
    this.password = process.env.RABBITMQ_PASSWORD || 'guest';
  }
}
