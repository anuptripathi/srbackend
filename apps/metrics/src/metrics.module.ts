import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/metrics/.env',
    }),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
