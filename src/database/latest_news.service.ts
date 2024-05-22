import { Injectable } from '@nestjs/common';
import { LatestNews } from './schemas/latest_news.schema';

@Injectable()
export class LatestNewsService {
  private latestNewsCache: LatestNews[] = [];
  private readonly cacheSize: number = 10;

  findAll(): LatestNews[] {
    return this.latestNewsCache;
  }

  async pushOne(latestNews: LatestNews): Promise<void> {
    if (this.latestNewsCache.length === this.cacheSize) {
      this.latestNewsCache.shift();
    }
    this.latestNewsCache.push(latestNews);
  }
}
