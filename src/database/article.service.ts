import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Types } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  async findAll(
    filter: { 
      keyword?: string 
      tag?: string,
      category?: string,
    } = {}, 
    options: QueryOptions = { limit: 30 }
  ): Promise<Article[]> {
    try {
      let query = {};
  
      console.log(
          'filter:',
          'keyword:', filter.keyword,
          'tag:', filter.tag,
          'category:', filter.category,
          'options:', options
      );
  
      if (filter.keyword) {
        query = {
          $or: [
            { title: { $regex: filter.keyword, $options: 'i' } },
          ],
        };
      } else if (filter.tag) {
        query = { tags: filter.tag };
      } else if (filter.category) {
        query = { category: filter.category };
      }
  
      const count = await this.articleModel.countDocuments(query);
  
      console.log('Number of articles matched with the keyword:', count);
  
      // limit articles
      let finalQuery = this.articleModel.find(query);
      if (options.limit) {
        finalQuery = finalQuery.limit(options.limit);
      }
  
      // descending order
      finalQuery = finalQuery.sort({ _id: -1 });
  
      const articles = await finalQuery.exec();
  
      // if empty
      if (!articles || articles.length === 0) {
        console.log('No articles found with the matching keyword!');
      }
  
      //print article link and title in terminal
      articles.forEach(article => {
        console.log('Title:', article.title);
        console.log('Link:', `https://sync.muilab.org/#/article/${article._id}`);
      });
  
      return articles;
    } catch (error) {
      // error if failed to get article
      console.log('Article Not Found');
    }
  }

  async findOneById(id: Types.ObjectId): Promise<Article> {
    return this.articleModel.findById(id).exec();
  }

  async createOne(article: Article): Promise<Article> {
    return this.articleModel.create(article);
  }

  async updateOneById(id: Types.ObjectId, partialArticle: Partial<Article>) {
    return this.articleModel.updateOne({ _id: id }, partialArticle).exec();
  }

  async deleteOneById(id: Types.ObjectId) {
    return this.articleModel.deleteOne({ _id: id }).exec();
  }

  async findAuthorsByArticleId(articleId: string) {
    try {
      const article = await this.articleModel.findById(articleId).exec();

      const authors = article.authors.map(author => ({
        uid: author.uid,
        name: author.name,
        isAnonymous: author.isAnonymous,
      }));

      return authors;
    } catch (error) {
      console.log('Article Not Found')
    }
  }
}