import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { LatestNews } from './schemas/latest_news.schema';
import { LatestNewsService } from './latest_news.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly latestNewsService: LatestNewsService,
  ) {}

  async findAll(
    filter?: object,
    options: QueryOptions = { limit: 30 },
  ): Promise<Article[]> {
    return this.articleModel.find(filter ?? {}, null, options).exec();
  }

  async findOneById(id: Types.ObjectId): Promise<Article> {
    return this.articleModel.findById(id).exec();
  }

  async createOne(article: Article): Promise<Article> {
    const createdArticle = await this.articleModel.create(article);
    await this.updateLatestNews(createdArticle);
    return createdArticle;
  }

  async updateOneById(id: Types.ObjectId, partialArticle: Partial<Article>) {
    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, partialArticle, { new: true })
      .exec();
    await this.updateLatestNews(updatedArticle);
    return updatedArticle;
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.articleModel.deleteOne({ _id: id }).exec();
  }

  async updateLatestNews(article: ArticleDocument) {
    const latestNews: LatestNews = {
      articleId: article._id,
      updatedAt: new Date(),
    };
    await this.latestNewsService.pushOne(latestNews);
  }
}
