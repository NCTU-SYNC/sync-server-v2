import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

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
class Block {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  blockId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  contentId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  revisionIndex: number;
}

const BlockSchema = SchemaFactory.createForClass(Block);

@Schema()
class Versions {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ type: [BlockSchema], default: [] })
  blocks?: Block[];

  @Prop({ required: true, type: [AuthorSchema] })
  authors: Author[];

  @Prop({ type: [raw({ title: String, url: String })], default: [] })
  citations?: Record<string, any>[];

  @Prop({ required: true })
  versionIndex: number;

  @Prop({
    type: raw({ added: Number, urdeletedl: Number }),
    default: { added: 0, urdeletedl: 0 },
  })
  wordsChanged: Record<string, any>;
}

const VersionsSchema = SchemaFactory.createForClass(Versions);

@Schema()
export class Version {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  articleId: mongoose.Types.ObjectId;

  @Prop({ rtype: [VersionsSchema] })
  versions?: Versions[];
}

export type VersionDocument = mongoose.HydratedDocument<Version>;

export const VersionSchema = SchemaFactory.createForClass(Version);
