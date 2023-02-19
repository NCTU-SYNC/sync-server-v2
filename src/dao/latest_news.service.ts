import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { LatestNews, LatestNewsDocument } from '../schemas/latest_news.schema';

@Injectable()
export class LatestNewsService {
  constructor(
    @InjectModel(LatestNews.name)
    private readonly latestNewsModel: Model<LatestNewsDocument>,
  ) {}

  async findOneById(id: mongoose.Types.ObjectId): Promise<LatestNews> {
    return this.latestNewsModel.findById(id).exec();
  }

  async createOne(latestNews: LatestNews): Promise<LatestNews> {
    return this.latestNewsModel.create(latestNews);
  }

  async updateOneById(
    id: mongoose.Types.ObjectId,
    partialLatestNews: Partial<LatestNews>,
  ) {
    return this.latestNewsModel
      .updateOne({ _id: id }, partialLatestNews)
      .exec();
  }

  async deleteOneById(id: mongoose.Types.ObjectId) {
    return this.latestNewsModel.deleteOne({ _id: id }).exec();
  }
}
