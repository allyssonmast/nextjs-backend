import { Avatar } from '../../schemas/avatar.schema';

export const avatarStub = (): Avatar => {
  return {
    imageId: 'test-image-id',
    imageData: Buffer.from('test-image-data'),
  };
};
