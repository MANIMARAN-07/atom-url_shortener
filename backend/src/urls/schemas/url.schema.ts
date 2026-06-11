import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema({ timestamps: true })
export class Url {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true, index: true })
  shortCode: string;

  @Prop()
  title?: string;

  @Prop({ default: 0 })
  totalClicks: number;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
