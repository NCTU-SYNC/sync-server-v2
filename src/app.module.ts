import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV_CONFIG = () => ({
  port: parseInt(process.env.PORT, 10),
  baseUrl: '/api',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ENV_CONFIG],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
