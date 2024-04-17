import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ArticleService } from '../article.service';
import { Article } from '../schemas/article.schema';
import { Types } from 'mongoose';


@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: 'Find all articles', description: 'Get a list of all articles' })
  @ApiResponse({ status: 200, description: 'List of articles returned successfully', type: Article, isArray: true })
  @ApiQuery({ name: 'q', required: false, description: 'Keyword to search in article title or tags' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of articles to return' })
  @ApiQuery({ name: 'tag', required: false, description: 'Hashtag to filter articles' })
  @ApiQuery({ name: 'category', required: false, description: 'Category to filter articles (政經, 國際, 社會, 科技, 環境, 生活, 運動)' })
  async findAll(
    @Query('q') keyword?: string, 
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
    @Query('category') category?: string,
  ): Promise<Article[]> {
    const query = {};
    if (keyword) {
      query['$or'] = [
        { title: { $regex: keyword, $options: 'i' } },
        { outline: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (tag) {
      query['tags'] = tag 
    } 
    if (category) {
      query['category'] = category
    }
    const options = {limit: limit};  
    return this.articleService.findAll(query, options);
  }

  @Get(':id')
  async findOneByID(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOneById(new Types.ObjectId(id));
  }
}