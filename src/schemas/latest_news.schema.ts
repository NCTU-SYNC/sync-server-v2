import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class LatestNews {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  articleId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  updatedAt?: Date;
}

export type LatestNewsDocument = mongoose.HydratedDocument<LatestNews>;

export const LatestNewsSchema = SchemaFactory.createForClass(LatestNews);
