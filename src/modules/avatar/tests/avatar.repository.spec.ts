import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Avatar } from '../schemas/avatar.schema';
import { FilterQuery } from 'mongoose';
import { IUserApi } from 'src/utils/interfaces/user-api.interface';
import { AvatarRepository } from '../repository/avatar.repository';
import { AvatarModel } from './support/avatar.model';
import { avatarStub } from './stubs/avatar.stub';

describe('AvatarRepository', () => {
  let avatarRepository: AvatarRepository;
  let userModel: AvatarModel;
  let userApi: IUserApi;
  const exec = { exec: jest.fn() };
  let userFilterQuery: FilterQuery<Avatar>;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AvatarRepository,
        {
          provide: getModelToken(Avatar.name),
          useClass: AvatarModel,
        },
        {
          provide: 'IUserApi',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    avatarRepository = moduleRef.get<AvatarRepository>(AvatarRepository);
    userModel = moduleRef.get<AvatarModel>(getModelToken(Avatar.name));
    userApi = moduleRef.get<IUserApi>('IUserApi');
    userFilterQuery = {
      userId: avatarStub().imageId,
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getUserById', () => {
    it('should call userApi.findById with the given userId', async () => {
      const userId = 1;

      await avatarRepository.getUserById(userId);

      expect(userApi.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('saveImage', () => {
    it('should call imageModel.save with the given image', async () => {
      const image = new Avatar();

      await avatarRepository.saveImage(image);

      expect(userModel.save).toHaveBeenCalled();
    });
  });

  describe('findImageById', () => {
    it('should call imageModel.findOne with the given imageId', async () => {
      const imageId = '1';

      await avatarRepository.findImageById(imageId);

      expect(userModel.findOne).toHaveBeenCalledWith({ imageId: imageId });
    });
  });

  describe('removeEntryFromDB', () => {
    it('should call imageModel.deleteOne with the given imageId', async () => {
      const imageId = '1';

      await avatarRepository.removeEntryFromDB(imageId);

      expect(userModel.deleteOne).toHaveBeenCalledWith({ imageId: imageId });
    });
  });
});
