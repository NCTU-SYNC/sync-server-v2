import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  SwaggerCustomOptions,
  DocumentBuilder,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as path from 'path';
import * as fs from 'fs';

function createSwaggerDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('SYNC API')
    .setDescription('The SYNC API spec')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  return document;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = createSwaggerDocument(app);

  const configService = app.get(ConfigService);

  if (configService.get('NODE_ENV') === 'document') {
    const outputPath = path.resolve(process.cwd(), 'swagger.json');
    fs.writeFileSync(outputPath, JSON.stringify(document));

    await app.close();
  } else {
    const customOptions: SwaggerCustomOptions = {
      explorer: true,
    };
    SwaggerModule.setup('doc', app, document, customOptions);

    const port = configService.get<number>('port', 3000);
    const baseUrl = configService.get<string>('baseUrl', '/api');

    app.setGlobalPrefix(baseUrl);
    app.enableVersioning({ type: VersioningType.URI });
    await app.listen(port);
  }
}

bootstrap();
