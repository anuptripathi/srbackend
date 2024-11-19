import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import {
  DatabaseModule,
  LoggerModule,
  AuthGrpcClientsModule,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { MetricsSchema, MetricsDocument } from './metrics.schema';
import { MetricsRepository } from './metrics.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MetricsDocument.name, schema: MetricsSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/metrics/.env',
    }),
    AuthGrpcClientsModule,
  ],
  controllers: [MetricsController],
  providers: [MetricsService, MetricsRepository],
})
export class MetricsModule {}
