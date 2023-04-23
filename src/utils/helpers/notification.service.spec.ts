import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { RabbitMQConfig } from './rabbit.config';

describe('NotificationService', () => {
  let service: NotificationService;
  let rabbitConfig: RabbitMQConfig;

  beforeEach(async () => {
    //amqp://127.0.0.1:5672
    rabbitConfig = {
      url: 'amqp://localhost:5672',
      login: 'guest',
      password: 'guest',
      queueName: 'teste',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: RabbitMQConfig,
          useValue: rabbitConfig,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(async () => {
    await service.closeConnection();
  });

  it('should send email notification', async () => {
    const email = 'test@example.com';
    const message = 'Test message';
    const sendEmailSpy = jest.spyOn(service, 'sendEmailNotification');

    await service.sendEmailNotification(email, message);

    expect(sendEmailSpy).toHaveBeenCalledWith(email, message);
    expect(service['connection']).toBeDefined();
    expect(service['channel']).toBeDefined();
  });
});
