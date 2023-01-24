import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const environmentConfig = () => ({
  port: parseInt(process.env.PORT, 10),
  baseUrl: '/api',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
