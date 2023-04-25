import { EmailDto } from '../dto/email.dto';

export interface IEmailService {
  sendEmail(email: EmailDto): Promise<void>;
}
