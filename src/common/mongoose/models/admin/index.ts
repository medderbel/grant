import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FILE } from '../../consts/consts';

@Schema()
export class Admin {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: FILE,
    required: true,
  })
  image: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  isArchived: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
