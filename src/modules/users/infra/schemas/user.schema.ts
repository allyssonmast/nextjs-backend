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

import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar: { type: String },
  avatarFilename: { type: String },
  avatarBase64: { type: String },
});
