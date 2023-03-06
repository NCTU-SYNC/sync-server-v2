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
class Revision {
  @Prop({ required: true, type: Date })
  updatedAt: Date;

  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId] })
  contentId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  blockTitle: string;

  @Prop({ required: true, type: [AuthorSchema] })
  author: Author;

  @Prop({ required: true, type: Number })
  revisionIndex: number;
}

const RevisionSchema = SchemaFactory.createForClass(Revision);

@Schema()
export class Block {
  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId] })
  blockId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId] })
  articleId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: [AuthorSchema] })
  authors: Author[];

  @Prop({ type: [RevisionSchema] })
  revisions?: Revision[];
}

export type BlockDocument = mongoose.HydratedDocument<Block>;

export const BlockSchema = SchemaFactory.createForClass(Block);
