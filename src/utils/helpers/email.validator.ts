import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailValidator {
  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
  }
}
