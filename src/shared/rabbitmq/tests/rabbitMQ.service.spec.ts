import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from '../rabbitMQ.service';
import { RabbitMQConfig } from '../config/rabbit.config';

describe('NotificationService', () => {
  let service: RabbitMQService;
  let rabbitConfig: RabbitMQConfig;

  beforeEach(async () => {
    //amqp://127.0.0.1:5672
    //amqp://localhost:5672
    rabbitConfig = {
      url: 'amqp://127.0.0.1:5672',
      login: 'guest',
      password: 'guest',
      queueName: 'teste',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: RabbitMQConfig,
          useValue: rabbitConfig,
        },
      ],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
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
