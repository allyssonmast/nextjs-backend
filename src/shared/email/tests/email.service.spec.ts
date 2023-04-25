import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../email.service';
import { EmailSendingException } from '../exceptions/emailSend.exception';
import { EmailDto } from '../dto/email.dto';
import { ConfigModule } from '@nestjs/config'; // Importe o ConfigModule aqui

describe('MessageService', () => {
  let messageService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        EmailService,
        {
          provide: 'SMTP_CONFIG',
          useValue: {
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          },
        },
      ],
    }).compile();

    messageService = module.get<EmailService>(EmailService);
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const emailDto: EmailDto = {
        to: 'example@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
      };

      await expect(messageService.sendEmail(emailDto)).resolves.not.toThrow();
    });

    it('should throw EmailSendingException when email sending fails', async () => {
      const emailDto: EmailDto = {
        to: 'example@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
      };

      jest
        .spyOn(messageService['transporter'], 'sendMail')
        .mockImplementationOnce(() => {
          throw new Error('Error sending email');
        });

      await expect(messageService.sendEmail(emailDto)).rejects.toThrow(
        EmailSendingException,
      );
    });
  });
});
