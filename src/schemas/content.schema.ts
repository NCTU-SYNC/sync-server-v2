import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Content {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  blockId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  articleId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  content?: object;
}

export type ContentDocument = mongoose.HydratedDocument<Content>;

export const ContentSchema = SchemaFactory.createForClass(Content);
