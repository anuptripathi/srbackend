import { NestFactory } from '@nestjs/core';
import { MetricsModule } from './metrics.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(MetricsModule);
  app.use(
    '/metrics/telegraf',
    bodyParser.text({
      type: 'text/plain',
      limit: '10mb', // Adjust this limit based on your needs (e.g., '10mb', '50mb', etc.)
    }),
  );
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('metrics');
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('HTTP_PORT');
  //const mongoUri = configService.getOrThrow<number>('MONGODB_URI');
  //const authgrpc = configService.getOrThrow<number>('AUTH_GRPC_URL');
  //console.log('configurations', port, mongoUri, authgrpc);
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
