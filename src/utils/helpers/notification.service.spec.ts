import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { RabbitMQConfig } from './rabbit.config';
import { connect, Channel, Connection } from 'amqplib';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let rabbitMQConfig: RabbitMQConfig;
  let mockChannel: Channel;
  let mockConnection: Connection;

  beforeEach(async () => {
    mockChannel = {
      sendToQueue: jest.fn(),
      assertQueue: jest.fn(),
      on: jest.fn(),
      close: jest.fn(),
    } as unknown as Channel;

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      on: jest.fn(),
      close: jest.fn(),
    } as unknown as Connection;

    rabbitMQConfig = {
      url: 'amqp://guest:guest@localhost:1:5672/',
      queueName: 'notifications',
      login: 'guest',
      password: 'guest',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: RabbitMQConfig,
          useValue: rabbitMQConfig,
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
  });

  afterEach(async () => {});

  it('should send email notification', async () => {
    const email = 'example@example.com';
    const message = 'Test message';

    await notificationService.sendEmailNotification(email, message);

    expect(connect).toHaveBeenCalledWith(rabbitMQConfig.url);
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith(
      rabbitMQConfig.queueName,
      {
        durable: true,
      },
    );
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      rabbitMQConfig.queueName,
      Buffer.from(JSON.stringify({ email, message })),
      { persistent: true },
    );
  });
});
