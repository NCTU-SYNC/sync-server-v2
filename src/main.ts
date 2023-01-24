import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  SwaggerCustomOptions,
  DocumentBuilder,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('SYNC API')
    .setDescription('The SYNC API spec')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    explorer: true,
  };

  SwaggerModule.setup('doc', app, document, customOptions);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get('port', 3000);
  const baseUrl = configService.get('baseUrl', '/api');

  app.setGlobalPrefix(baseUrl);
  await app.listen(port);
}

bootstrap();
