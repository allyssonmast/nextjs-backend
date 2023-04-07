import { AvatarController } from './avatar.controller';
import { AvatarService } from '../../infra/services/avatar.service';

jest.mock('../../infra/services/user.service');
jest.mock('../../infra/services/avatar.service');

const mockAvatarService = {
  getUserAvatar: jest.fn() as any,
  deleteAvatar: jest.fn() as any,
};

describe('UserController', () => {
  let userController: AvatarController;

  beforeEach(() => {
    userController = new AvatarController(mockAvatarService as AvatarService);
  });

  describe('getUserAvatar', () => {
    it('should call avatarService.getUserAvatar with correct userId', async () => {
      const userId = 1;
      const avatarUrl = 'https://example.com/avatar.jpg';

      mockAvatarService.getUserAvatar.mockResolvedValueOnce(avatarUrl);

      const result = await userController.getUserAvatar(userId);

      expect(mockAvatarService.getUserAvatar).toHaveBeenCalledWith(userId);
      expect(result).toEqual(avatarUrl);
    });
  });

  describe('deleteAvatar', () => {
    it('should call avatarService.deleteAvatar with correct userId', async () => {
      const userId = 1;

      mockAvatarService.deleteAvatar.mockResolvedValueOnce();

      await userController.deleteAvatar(userId);

      expect(mockAvatarService.deleteAvatar).toHaveBeenCalledWith(userId);
    });
  });
});
