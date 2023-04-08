import { NotificationService } from './notification.service';
import { RabbitMQConfig } from './rabbit.config';

describe('NotificationService', () => {
  const mockRabbitMQConfig: RabbitMQConfig = {
    url: 'amqp://localhost:5672',
    queueName: 'testQueue',
    login: 'guest',
    password: 'guest',
  };
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService(mockRabbitMQConfig);
  });

  afterEach(async () => {
    await notificationService.onApplicationShutdown();
  });

  describe('sendEmailNotification', () => {
    it('should send email notification', async () => {
      const mockAssertQueue = jest.fn();
      const mockSendToQueue = jest.fn();
      const mockChannel = {
        assertQueue: mockAssertQueue,
        sendToQueue: mockSendToQueue,
      };
      const mockCreateChannel = jest.fn().mockResolvedValue(mockChannel);
      const mockConnection = {
        createChannel: mockCreateChannel,
      };
      const mockConnect = jest.fn().mockResolvedValue(mockConnection);
      jest
        .spyOn(notificationService as any, 'getConnection')
        .mockReturnValue(mockConnect);

      const email = 'john.doe@example.com';
      const message = 'Hello, world!';
      await notificationService.sendEmailNotification(email, message);

      expect(mockConnect).toHaveBeenCalledWith(mockRabbitMQConfig.url);
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockAssertQueue).toHaveBeenCalledWith(
        mockRabbitMQConfig.queueName,
        {
          durable: true,
        },
      );
      expect(mockSendToQueue).toHaveBeenCalledWith(
        mockRabbitMQConfig.queueName,
        Buffer.from(JSON.stringify({ email, message })),
        { persistent: true },
      );
    });
  });
});
