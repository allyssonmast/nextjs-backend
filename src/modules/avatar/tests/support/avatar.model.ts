import { MockModel } from '../../../database/test/support/mock.model';
import { Avatar } from '../../schemas/avatar.schema';
import { avatarStub } from '../stubs/avatar.stub';

export class AvatarModel extends MockModel<Avatar> {
  protected entityStub = avatarStub();
}
