import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailSendingException extends HttpException {
  constructor(message: string) {
    super(`Failed to send email: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
