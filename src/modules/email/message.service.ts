import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IEmailService } from './interfaces/message.service.interface';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from './dto/email.dto';
import { EmailSendingException } from './exceptions/emailSend.exception';

@Injectable()
export class MessageService implements IEmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmail(emailDto: EmailDto): Promise<void> {
    const { to, subject, text } = emailDto;
    const message = {
      from: this.configService.get<string>('SMTP_USER'),
      to,
      subject,
      text,
    };
    try {
      await this.transporter.sendMail(message);
    } catch (error) {
      throw new EmailSendingException(error.message);
    }
  }
}
