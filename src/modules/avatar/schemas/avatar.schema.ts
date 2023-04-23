import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
  @Prop({ type: String, required: true })
  imageId: string;

  @Prop({ type: Buffer, required: true })
  imageData: Buffer;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
