import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { News, NewsDocument } from '../schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsModel: Model<NewsDocument>,
  ) {}

  async findOneById(id: mongoose.Types.ObjectId): Promise<News> {
    return this.newsModel.findById(id).exec();
  }

  async createOne(news: News): Promise<News> {
    return this.newsModel.create(news);
  }

  async updateOneById(id: mongoose.Types.ObjectId, partialNews: Partial<News>) {
    return this.newsModel.updateOne({ _id: id }, partialNews).exec();
  }

  async deleteOneById(id: mongoose.Types.ObjectId) {
    return this.newsModel.deleteOne({ _id: id }).exec();
  }
}
