import { NestFactory } from '@nestjs/core';
import { MetricsModule } from './metrics.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(MetricsModule);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('metrics');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('HTTP_PORT');
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
