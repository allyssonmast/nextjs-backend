import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { RabbitMQConfig } from './config/rabbit.config';

@Injectable()
export class RabbitMQService implements OnApplicationShutdown {
  private connection: Connection;
  private channel: Channel;

  constructor(private readonly rabbitMQConfig: RabbitMQConfig) {}

  async sendEmailNotification(email: string, message: string): Promise<void> {
    if (!this.connection) {
      const { url, login, password } = this.rabbitMQConfig;
      const connectionUrl = url.replace(
        'amqp://',
        `amqp://${login}:${password}@`
      );
      this.connection = await connect(connectionUrl);
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err.message);
      });
      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
      });
    }

    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      this.channel.on('error', (err) => {
        console.error('RabbitMQ channel error:', err.message);
      });
      this.channel.on('close', () => {
        console.log('RabbitMQ channel closed');
      });
      await this.channel.assertQueue(this.rabbitMQConfig.queueName, {
        durable: true,
      });
    }

    const msg = JSON.stringify({ email, message });
    this.channel.sendToQueue(this.rabbitMQConfig.queueName, Buffer.from(msg), {
      persistent: true,
    });
    console.log(
      'queueName:',
      this.rabbitMQConfig.queueName,
      'message:',
      message
    );
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    console.log(`Application is shutting down with signal ${signal}`);
    await this.closeConnection();
  }

  async closeConnection(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (err) {
      console.error('Error closing RabbitMQ connection:', err.message);
    }
  }
}
