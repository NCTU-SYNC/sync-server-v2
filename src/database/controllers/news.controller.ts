import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from '../news.service';
import { News } from '../schemas/news.schema';
import { Types } from 'mongoose';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(
    @Query('q') keyword?: string,
    @Query('limit') limit?: number,
  ): Promise<News[]> {
    const query = {};
    if (keyword) {
      query['$or'] = [
        { title: { $regex: keyword, $options: 'i' } },
        { outline: { $regex: keyword, $options: 'i' } },
      ];
    }
    const options = { limit: limit || 30 };
    return this.newsService.findAll(query, options);
  }

  @Get(':id')
  async findOneById(@Param('id') id: Types.ObjectId): Promise<News> {
    return this.newsService.findOneById(new Types.ObjectId(id));
  }
}
