import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommonModel } from '../common';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User extends CommonModel {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  FirstName: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  LastName: string;
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  email: string;
  @Prop({
    type: String,
    select: true,
    required: true,
  })
  password: string;
  @Prop({
    type: Date,
    required: true,
  })
  birthDate: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
