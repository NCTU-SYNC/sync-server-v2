import * as path from 'path';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  SwaggerCustomOptions,
  DocumentBuilder,
} from '@nestjs/swagger';
import * as admin from 'firebase-admin';
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

async function setupFirebase(app: INestApplication) {
  const configService = app.get(ConfigService);
  const firebaseConfigFile = configService.get<string>('FIREBASE_CREDENTIALS');
  const firebaseDbUrl = configService.get<string>('FIREBASE_DB_URL');

  import(path.join(process.cwd(), 'config', firebaseConfigFile)).then(
    (firebaseConfig) =>
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: firebaseDbUrl,
      }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  await setupFirebase(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  const baseUrl = configService.get<string>('baseUrl', '/api');

  app.setGlobalPrefix(baseUrl);
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(port);
}

bootstrap();
