import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Image } from '../../modules/users/infra/schemas/avatar.schema'; // Importe a interface de Image

@Injectable()
export class ImageService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}

  async downloadImage(user): Promise<string> {
    const response = await axios.get(user.avatar, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const image = new this.imageModel({
      // Use this.imageModel em vez de ImageModel
      imageId: user.id, // Substitua pelo ID desejado para a imagem
      imageData: imageBuffer,
    });

    await image.save();
    const savedImage = await this.imageModel.findById(image._id); // Use this.imageModel em vez de ImageModel
    const imageDataBase64 = savedImage.imageData.toString('base64');

    return imageDataBase64;
  }
}
