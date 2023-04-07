import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitMQConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  url: string;
  queueName: string;

  constructor() {
    this.host = 'localhost';
    this.port = 5672;
    this.user = 'guest';
    this.password = 'password';
    this.queueName = 'notification_queue';
    this.url = 'amqp://guest:password@localhost:5672/';
  }
}
