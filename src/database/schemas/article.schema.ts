import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ _id: false })
class Author {
  @Prop()
  uid?: string;

  @Prop()
  name?: string;

  @Prop()
  isAnonymous?: boolean;
}

const AuthorSchema = SchemaFactory.createForClass(Author);

@Schema()
export class Block {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  blockTitle: string;

  @Prop({ required: true })
  blockDateTime: Date;

  @Prop()
  timeEnable?: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  content?: object;

  @Prop({ required: true, type: [AuthorSchema] })
  authors: Author[];
}

const BlockSchema = SchemaFactory.createForClass(Block);

@Schema({ collection: 'Articles' })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ required: true, type: [AuthorSchema], default: [] })
  authors: Author[];

  @Prop({ default: '' })
  category?: string;

  @Prop()
  citations?: [];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  lastUpdatedAt?: Date;

  @Prop({ default: false })
  isPopular?: boolean;

  @Prop({ default: 0 })
  editingCount?: number;

  @Prop({ default: 1 })
  editedCount?: number;

  @Prop({ default: 0 })
  viewsCount?: number;

  @Prop({ type: [BlockSchema] })
  blocks?: Block[];
}

export type ArticleDocument = mongoose.HydratedDocument<Article>;

export const ArticleSchema = SchemaFactory.createForClass(Article);
