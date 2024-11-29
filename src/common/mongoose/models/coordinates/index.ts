import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FILE } from '../../consts/consts';

@Schema({ timestamps: true })
export class Coordinate {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: mongoose.Schema.Types.ObjectId;
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
    type: String,
    enum: ['male', 'female'],
    select: true,
    required: true,
  })
  gender: string;
  @Prop({
    type: Date,
    select: true,
    required: true,
    min: 18,
  })
  birthDate: Date;

  @Prop({
    type: String,
    select: true,
    required: true,
    match: [/^\d{8}$/, 'Phone number must be exactly 8 digits'],
    minlength: 8,
    maxlength: 8,
  })
  phone: string;
  @Prop({
    type: String,
    select: true,
    required: true,
  })
  adress: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: FILE,
    required: true,
  })
  image: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;
}
export const CoordinateSchema = SchemaFactory.createForClass(Coordinate);
