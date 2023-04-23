import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Avatar } from '../schemas/avatar.schema';
import { IUserApi } from 'src/utils/interfaces/user-api.interface';
import { AvatarRepository } from '../repository/avatar.repository';
import { AvatarModel } from './support/avatar.model';
import { avatarStub } from './stubs/avatar.stub';

describe('AvatarRepository', () => {
  let avatarRepository: AvatarRepository;
  let userModel: AvatarModel;
  let userApi: IUserApi;

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

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('getUserById', () => {
    it('should call userApi.findById with the given userId', async () => {
      const userId = 1;
      const findByIdSpy = jest
        .spyOn(userApi, 'findById')
        .mockResolvedValueOnce(undefined);

      await avatarRepository.getUserById(userId);

      expect(findByIdSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('saveImage', () => {
    it('should call imageModel.save with the given image', async () => {
      const image = new Avatar();
      const spy = jest.spyOn(AvatarModel.prototype, 'save');

      await avatarRepository.saveImage(image);

      expect(spy).toHaveBeenCalledWith();
    });
    it('should throw an error if imageModel.save throws an error', async () => {
      const image = new Avatar();
      const saveSpy = jest
        .spyOn(AvatarModel.prototype, 'save')
        .mockImplementation(() => {
          throw new Error('Some error occurred');
        });

      await expect(avatarRepository.saveImage(image)).rejects.toThrowError(
        /Failed to save image/,
      );
      expect(saveSpy).toHaveBeenCalledWith(image);
    });
  });

  describe('findImageById', () => {
    it('should call imageModel.findOne with the given imageId', async () => {
      const imageId = '1';
      const spy = jest.spyOn(AvatarModel.prototype, 'findOne');

      const result = await avatarRepository.findImageById(imageId);

      expect(spy).toHaveBeenCalledWith({ imageId });
      expect(result).toEqual(avatarStub());
    });
    it('should throw an error if imageModel.findOne throws an error', async () => {
      const imageId = '1';
      const findOneSpy = jest
        .spyOn(userModel, 'findOne')
        .mockImplementation(() => {
          throw new Error('Some error occurred');
        });

      await expect(
        avatarRepository.findImageById(imageId),
      ).rejects.toThrowError(/Failed to find image by id/);
      expect(findOneSpy).toHaveBeenCalledWith({ imageId });
    });

    it('should throw an error if imageModel.findOne returns null', async () => {
      const imageId = '1';
      const findOneSpy = jest.spyOn(userModel, 'findOne').mockReturnValue(null);

      await expect(
        avatarRepository.findImageById(imageId),
      ).rejects.toThrowError(
        "Failed to find image by id: Cannot read properties of null (reading 'exec')",
      );
      expect(findOneSpy).toHaveBeenCalledWith({ imageId });
    });
  });

  describe('removeEntryFromDB', () => {
    it('should call imageModel.deleteOne with the given imageId', async () => {
      const imageId = '1';
      const spy = jest.spyOn(userModel, 'deleteOne');

      await avatarRepository.removeEntryFromDB(imageId);

      expect(spy).toHaveBeenCalledWith({ imageId });
    });
    it('should throw an error if imageModel.deleteOne throws an error', async () => {
      const imageId = '1';
      const deleteOneSpy = jest
        .spyOn(userModel, 'deleteOne')
        .mockImplementation(() => {
          throw new Error('Some error occurred');
        });

      await expect(
        avatarRepository.removeEntryFromDB(imageId),
      ).rejects.toThrowError(/Failed to remove avatar entry from DB/);
      expect(deleteOneSpy).toHaveBeenCalledWith({ imageId });
    });
  });
});
