import { NatsConfig } from '@config/nats.config';
import { ExceptionInterceptor } from '@core/interceptors/exception.interceptor';
import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
import fastifyMultipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { APIPrefix } from './common/index';
import { ConfigService } from './config/config.service';
import { LoggerConfig } from '@config/logger.config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const configService = new ConfigService();

  fastifyAdapter.register(fastifyMultipart, {
    attachFieldsToBody: true,
    addToBody: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: LoggerConfig,
    },
  );

  app.connectMicroservice(NatsConfig, { inheritAppConfig: true });

  await app.startAllMicroservices();

  app.setGlobalPrefix(APIPrefix.Version);
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addBearerAuth(
      { type: 'http', description: 'Access token' },
      'access-token',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/v1/purchased-orders/swagger-docs', app, document);

  let corsOptions = {};
  if (configService.get('corsOrigin')) {
    corsOptions = {
      origin: new ConfigService().get('corsOrigin'),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), corsOptions);
  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionInterceptor());

  await app.listen(new ConfigService().get('httpPort'), '0.0.0.0');
}

bootstrap();
