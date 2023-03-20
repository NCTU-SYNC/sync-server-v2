import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    FirebaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
