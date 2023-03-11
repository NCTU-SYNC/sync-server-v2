import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News, NewsDocument } from '../../schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<NewsDocument>,
  ) {}

  async findOneById(id: Types.ObjectId): Promise<News> {
    return this.newsModel.findById(id).exec();
  }

  async createOne(news: News): Promise<News> {
    return this.newsModel.create(news);
  }

  async updateOneById(id: Types.ObjectId, partialNews: Partial<News>) {
    return this.newsModel.updateOne({ _id: id }, partialNews).exec();
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.newsModel.deleteOne({ _id: id }).exec();
  }
}
