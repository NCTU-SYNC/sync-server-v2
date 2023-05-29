import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { Block, BlockSchema } from './schemas/block.schema';
import { Content, ContentSchema } from './schemas/content.schema';
import { LatestNews, LatestNewsSchema } from './schemas/latest_news.schema';
import { News, NewsSchema } from './schemas/news.schema';
import { Version, VersionSchema } from './schemas/version.schema';
import { ArticleService } from './article.service';
import { BlockService } from './block.service';
import { ContentService } from './content.service';
import { LatestNewsService } from './latest_news.service';
import { NewsService } from './news.service';
import { VersionService } from './version.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: Block.name, schema: BlockSchema },
      { name: Content.name, schema: ContentSchema },
      { name: LatestNews.name, schema: LatestNewsSchema },
      { name: News.name, schema: NewsSchema },
      { name: Version.name, schema: VersionSchema },
    ]),
  ],
  providers: [
    ArticleService,
    BlockService,
    ContentService,
    LatestNewsService,
    NewsService,
    VersionService,
  ],
  exports: [
    MongooseModule,
    ArticleService,
    BlockService,
    ContentService,
    LatestNewsService,
    NewsService,
    VersionService,
  ],
})
export class DatabaseModule {}
