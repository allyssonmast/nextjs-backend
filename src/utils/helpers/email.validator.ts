import { validate } from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async validateEmail(email: string): Promise<boolean> {
    const errors = await validate(
      { email },
      { validationError: { target: false } },
    );
    return errors.length === 0;
  }
}
