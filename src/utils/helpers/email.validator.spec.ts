import { EmailService } from './email.validator';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  describe('validateEmail', () => {
    it('should return true for valid email', async () => {
      const isValid = await emailService.validateEmail('validemail@test.com');
      expect(isValid).toBe(true);
    });

    it('should return false for invalid email', async () => {
      const isValid = await emailService.validateEmail('invalidemail');
      expect(isValid).toBe(false);
    });
  });
});
