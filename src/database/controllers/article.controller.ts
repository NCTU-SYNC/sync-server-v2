import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ArticleService } from '../article.service';
import { Article } from '../schemas/article.schema';
import { Types } from 'mongoose';
import { LatestNewsService } from '../latest_news.service';
import { LatestNews } from '../schemas/latest_news.schema';
import { Logger } from '@nestjs/common';

@Controller('article')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

  constructor(
    private readonly articleService: ArticleService,
    private readonly latestNewsService: LatestNewsService,
  ) {}

  @Get()
  async findAll(
    @Query('q') keyword?: string,
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
    @Query('category') category?: string,
  ): Promise<{
    article: Article[];
    latestNews: LatestNews[];
  }> {
    const query = {};
    if (keyword) {
      query['$or'] = [
        { title: { $regex: keyword, $options: 'i' } },
        { outline: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (tag) {
      query['tags'] = tag;
    }
    if (category) {
      query['category'] = category;
    }
    const options = { limit: limit };
    const article = await this.articleService.findAll(query, options);
    const latestNews = this.latestNewsService.findAll();

    return {
      article,
      latestNews,
    };
  }

  @Get(':id')
  async findOneByID(@Param('id') id: Types.ObjectId): Promise<Article> {
    return this.articleService.findOneById(new Types.ObjectId(id));
  }

  @Get(':id/authors')
  async findAuthorsByID(
    @Param('id') id: Types.ObjectId,
  ): Promise<Article['authors']> {
    const article = await this.articleService.findOneById(
      new Types.ObjectId(id),
    );
    return article.authors;
  }

  @Put(':id')
  async updateOneById(
    @Param('id') id: Types.ObjectId,
    @Body() partialArticle: Partial<Article>,
  ): Promise<Article> {
    try {
      this.logger.log(`Received PUT request to update article with ID: ${id}`);
      this.logger.log(`Request body: ${JSON.stringify(partialArticle)}`);

      const updatedArticle = await this.articleService.updateOneById(
        id,
        partialArticle,
      );

      this.logger.log(`Article with ID: ${id} updated successfully.`);

      return updatedArticle;
    } catch (error) {
      this.logger.error(`Failed to update article with ID: ${id}`, error.stack);
      throw error;
    }
  }
}
