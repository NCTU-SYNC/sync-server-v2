import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Version, VersionDocument } from '../schemas/version.schema';

@Injectable()
export class VersionService {
  constructor(
    @InjectModel(Version.name)
    private readonly contentModel: Model<VersionDocument>,
  ) {}

  async findOneByArticleId(articleId: Types.ObjectId): Promise<Version> {
    return this.contentModel.findOne({ articleId: articleId }).exec();
  }

  async createOne(content: Version): Promise<Version> {
    return this.contentModel.create(content);
  }

  async updateOneById(id: Types.ObjectId, partialVersion: Partial<Version>) {
    return this.contentModel.updateOne({ _id: id }, partialVersion).exec();
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.contentModel.deleteOne({ _id: id }).exec();
  }
}
