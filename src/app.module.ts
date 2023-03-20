import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from './auth/firebase.module';

const ENV_CONFIG = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  baseUrl: '/api',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ENV_CONFIG],
      envFilePath: ['config/firebase.env'],
    }),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        credentialFilePath: config.get<string>('FIREBASE_CREDENTIALS'),
        databaseUri: config.get<string>('FIREBASE_DB_URL'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
