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

    it('should return false for email with spaces', async () => {
      const isValid = await emailService.validateEmail(
        'invalid email@test.com',
      );
      expect(isValid).toBe(false);
    });

    it('should return false for email without domain', async () => {
      const isValid = await emailService.validateEmail('invalidemail@');
      expect(isValid).toBe(false);
    });

    it('should return false for email without username', async () => {
      const isValid = await emailService.validateEmail('@test.com');
      expect(isValid).toBe(false);
    });

    it('should return false for email with invalid domain', async () => {
      const isValid = await emailService.validateEmail('invalidemail@test.');
      expect(isValid).toBe(false);
    });

    it('should return false for email with invalid characters in domain', async () => {
      const isValid = await emailService.validateEmail('invalidemail@test.!');
      expect(isValid).toBe(false);
    });
  });
});
