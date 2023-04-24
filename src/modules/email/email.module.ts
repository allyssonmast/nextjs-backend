import { Module } from '@nestjs/common';
import { EmailSendingException } from './exceptions/emailSend.exception';
import { MessageService } from './message.service';
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
      useClass: MessageService,
    },
    EmailSendingException,
  ],
})
export class EmailModule {}
