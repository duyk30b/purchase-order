import {
  ClassSerializerInterceptor,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { NatsOptions } from '@nestjs/microservices'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { contentParser } from 'fastify-multer'
import * as fs from 'fs'
import { SpelunkerModule } from 'nestjs-spelunker'
import * as path from 'path'
import { AppModule } from './app.module'
import { NatsConfig } from './components/transporter/nats/nats.config'
import { GlobalConfig } from './config/global.config'
import {
  ServerExceptionFilter,
  ValidationException,
} from './core/exception-filter/exception-filter'
import { AccessLogInterceptor } from './core/interceptor/access-log.interceptor'
import { TransformResponseInterceptor } from './core/interceptor/transform-response.interceptor'

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: ['error', 'warn', 'log', 'debug'],
    }
  )
  app.register(contentParser)
  app.useGlobalInterceptors(
    new AccessLogInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    }),
    new TransformResponseInterceptor()
  )

  app.useGlobalFilters(new ServerExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: false, value: false },
      skipMissingProperties: true, // no validate field undefined
      // whitelist: true, // no field not in DTO
      // forbidNonWhitelisted: true, // exception when field not in DTO
      transform: true, // use for DTO
      transformOptions: {
        excludeExtraneousValues: false, // exclude field not in class DTO => no
        exposeUnsetFields: false, // expose field undefined in DTO => no
      },
      exceptionFactory: (errors: ValidationError[] = []) =>
        new ValidationException(errors),
    })
  )

  app.connectMicroservice<NatsOptions>(NatsConfig, { inheritAppConfig: true })
  // app.connectMicroservice<KafkaOptions>(KafkaConfig, { inheritAppConfig: true })
  await app.startAllMicroservices()

  const CF = GlobalConfig()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), { origin: CF.CORS_ORIGINS })

  app.setGlobalPrefix(CF.API_PATH)

  if (CF.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('API docs')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', description: 'Access token' },
        'access-token'
      )
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(`${CF.API_PATH}/swagger-docs`, app, document, {
      swaggerOptions: { persistAuthorization: true },
    })
  }

  if (CF.NODE_ENV !== 'production') {
    const tree = SpelunkerModule.explore(app)
    const root = SpelunkerModule.graph(tree)
    const edges = SpelunkerModule.findGraphEdges(root).filter((e) => {
      const ignoreImports = [
        (moduleName) => moduleName.includes('I18nModule'),
        (moduleName) => moduleName.includes('ConfigModule'),
        (moduleName) => moduleName.includes('ConfigHostModule'),
        (moduleName) => moduleName.includes('DiscoveryModule'),
        (moduleName) => moduleName.includes('MongooseModule'),
        (moduleName) => moduleName.includes('MongooseCoreModule'),
        (moduleName) => moduleName.includes('HttpModule'),
        (moduleName) => moduleName.includes('ScheduleModule'),
        (moduleName) => moduleName.includes('BootModule'),
        (moduleName) => moduleName.includes('ConsulModule'),
        (moduleName) => moduleName.includes('ServiceModule'),
        (moduleName) => moduleName.includes('KongGatewayModule'),
      ]
      return (
        !ignoreImports.some((check) => check(e.from.module.name)) &&
        !ignoreImports.some((check) => check(e.to.module.name))
      )
    })

    const mermaidEdges = edges.map(
      ({ from, to }) => `  ${from.module.name}-->${to.module.name}`
    )

    const rootDirectory = process.cwd() // Get the root directory of the application
    const filePath = path.join(rootDirectory, 'diagram')

    fs.writeFile(
      filePath,
      'flowchart TD\n' + mermaidEdges.join('\n'),
      (err) => {}
    )

    // https://mermaid.live/
    // {
    //   "theme": "default",
    //   "maxTextSize": 9999999,
    //   "maxEdges": 2000
    // }
  }

  await app.listen(CF.SERVER_HTTP_PORT, '0.0.0.0', () => {
    console.log(
      `🚀 ===== [API] Server document: http://${CF.APP_HOST}:${CF.APP_CONTAINER_PORT}${CF.API_PATH}/swagger-docs =====`
    )
  })
}

bootstrap()
