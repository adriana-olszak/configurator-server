import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;

  // run only on dev envs
  if (process.env.APP_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Meskaria API')
      .setDescription('Meskaria API documentation')
      .setVersion('0.1')
      .addServer(`http://localhost:${port}/api`)
      .addTag('User')
      .addTag('TimeSlots')
      .addTag('Offer')
      .setBasePath(`http://localhost:${port}/api`)
      .addBearerAuth({ name: 'Authorization', in: 'header', type: 'apiKey' })
      .build();

    const document = SwaggerModule.createDocument(app, options, {
      ignoreGlobalPrefix: true,
    });

    SwaggerModule.setup(`/explore`, app, document);
  }

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
