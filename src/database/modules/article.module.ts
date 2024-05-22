import { Module } from '@nestjs/common';
import { ArticleController } from '../controllers/article.controller';
import { ArticleService } from '../article.service';
import { LatestNewsService } from '../latest_news.service';
import { Article, ArticleSchema } from '../schemas/article.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, LatestNewsService],
})
export class ArticleModule {}
