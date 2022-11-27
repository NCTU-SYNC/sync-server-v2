import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  SwaggerCustomOptions,
  DocumentBuilder,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SYNC API')
    .setDescription('The SYNC API spec')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    explorer: true,
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();
