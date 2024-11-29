import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommonModel } from '../common';

@Schema({ timestamps: true })
export class File extends CommonModel {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  path: string;
  @Prop({
    type: Number,
    required: true,
  })
  size: number;
}
export const FileSchema = SchemaFactory.createForClass(File);
