import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from './auth/firebase.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleController } from './database/controllers/article.controller';
import { ArticleService } from './database/article.service'; 
import { Article, ArticleSchema } from './database/schemas/article.schema'; 
const ENV_CONFIG = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  baseUrl: '/api',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ENV_CONFIG],
      envFilePath: ['config/firebase.env', 'config/mongodb.env'],
      expandVariables: true,
    }),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        credentialFilePath: config.get<string>('FIREBASE_CREDENTIALS'),
        databaseUri: config.get<string>('FIREBASE_DB_URL'),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class AppModule {}
