







import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from './auth/firebase.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './database/modules/article.module';
import { VersionModule } from './database/modules/version.module';

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
    ArticleModule,
    VersionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}