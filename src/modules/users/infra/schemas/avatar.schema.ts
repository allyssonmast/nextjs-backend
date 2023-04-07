import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop({ type: String, required: true })
  imageId: string;

  @Prop({ type: Buffer, required: true })
  imageData: Buffer;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
