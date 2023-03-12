import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
