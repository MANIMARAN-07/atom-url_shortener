import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ClickDocument = Click & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Click {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Url', required: true, index: true })
  urlId: string;

  @Prop()
  ipHash: string;

  @Prop()
  userAgent: string;

  @Prop()
  referrer: string;

  @Prop()
  country?: string;

  @Prop()
  device?: string;

  @Prop()
  browser?: string;
}

export const ClickSchema = SchemaFactory.createForClass(Click);
