import { ImageService } from './image.service';
import axios from 'axios';

jest.mock('axios');

describe('ImageService', () => {
  let imageService: ImageService;

  beforeEach(() => {
    imageService = new ImageService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should download and encode image to base64', async () => {
    const user = {
      avatar: 'https://example.com/avatar.jpg',
    };
    const buffer = Buffer.from('test image buffer');

    const axiosResponse = {
      data: buffer,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(axiosResponse);

    const result = await imageService.downloadImage(user);
    expect(result).toEqual(buffer.toString('base64'));
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(user.avatar, {
      responseType: 'arraybuffer',
    });
  });

  it('should throw an exception if user object does not have an avatar property', async () => {
    const userWithoutAvatar = { name: 'John Doe' };
    await expect(
      imageService.downloadImage(userWithoutAvatar)
    ).rejects.toThrow();
  });
});
