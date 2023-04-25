import { Module } from '@nestjs/common';
import { EmailSendingException } from './exceptions/emailSend.exception';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: 'IEmailService',
      useClass: EmailService,
    },
    EmailSendingException,
  ],
})
export class EmailModule {}
