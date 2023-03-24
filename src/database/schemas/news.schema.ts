import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class News {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  newsId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
  timeStamp?: Date;

  @Prop({ type: String })
  outline?: string;
}

export type NewsDocument = mongoose.HydratedDocument<News>;

export const NewsSchema = SchemaFactory.createForClass(News);
