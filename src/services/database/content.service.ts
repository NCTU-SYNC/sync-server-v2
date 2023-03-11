import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Content, ContentDocument } from '../../schemas/content.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
  ) {}

  async findOneById(id: Types.ObjectId): Promise<Content> {
    return this.contentModel.findById(id).exec();
  }

  async createOne(content: Content): Promise<Content> {
    return this.contentModel.create(content);
  }

  async updateOneById(id: Types.ObjectId, partialContent: Partial<Content>) {
    return this.contentModel.updateOne({ _id: id }, partialContent).exec();
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.contentModel.deleteOne({ _id: id }).exec();
  }
}
