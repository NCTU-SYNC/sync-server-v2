import { Module } from '@nestjs/common';
import { NewsController } from '../controllers/news.controller';
import { NewsService } from '../news.service';
import { News, NewsSchema } from '../schemas/news.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
