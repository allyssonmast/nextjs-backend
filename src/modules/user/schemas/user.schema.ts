import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop()
  email: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  avatar: string;

  @Prop()
  avatarFilename: string;

  @Prop()
  avatarBase64: string;
}

export const UserSchemaFactory = () => SchemaFactory.createForClass(User);
