import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { LatestNews, LatestNewsDocument } from './schemas/latest_news.schema';

@Injectable()
export class LatestNewsService {
  constructor(
    @InjectModel(LatestNews.name)
    private readonly latestNewsModel: Model<LatestNewsDocument>,
  ) {}

  async findAll(
    filter?: object,
    options: QueryOptions = { limit: 30 },
  ): Promise<LatestNews[]> {
    return this.latestNewsModel.find(filter ?? {}, null, options).exec();
  }

  async findOneById(id: Types.ObjectId): Promise<LatestNews> {
    return this.latestNewsModel.findById(id).exec();
  }

  async createOne(latestNews: LatestNews): Promise<LatestNews> {
    return this.latestNewsModel.create(latestNews);
  }

  async updateOneById(
    id: Types.ObjectId,
    partialLatestNews: Partial<LatestNews>,
  ) {
    return this.latestNewsModel
      .updateOne({ _id: id }, partialLatestNews)
      .exec();
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.latestNewsModel.deleteOne({ _id: id }).exec();
  }
}
