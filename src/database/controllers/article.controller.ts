import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticleService } from '../article.service';
import { Article } from '../schemas/article.schema';
import { Types } from 'mongoose';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Query() query: any): Promise<Article[]> {
    const { filter, ...options } = query;
    return this.articleService.findAll(filter, options);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOneById(new Types.ObjectId(id));
  }
}
