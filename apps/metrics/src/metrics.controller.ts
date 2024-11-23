// metrics.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Request, Response } from 'express';
import { CreateMetricsDto } from './createMetrics.dto';
import {
  CurrentUser,
  CurrentUserDto,
  JwtAuthGaurd,
  Subject,
  CapabilityGuard,
  RequiredCapability,
  Subjects,
  Actions,
} from '@app/common';

@Subject(Subjects.METRICS)
@UseGuards(JwtAuthGaurd, CapabilityGuard)
@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @RequiredCapability(Actions.ADD)
  @Post('telegraf')
  async receiveMetrics(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<void> {
    try {
      // Parse incoming metrics
      const metric = JSON.parse(req.body);
      if (!metric?.metrics) {
        throw new UnprocessableEntityException('Invalid metrics format');
      }
      const metrics = metric.metrics;
      if (Array.isArray(metrics)) {
        // If it's an array, map over it to structure the data
        const metricsDto: CreateMetricsDto[] = metrics;
        //console.log('Received Metrics:', JSON.stringify(metricsDto, null, 2));
        await this.metricsService.saveMetrics(metrics, user);

        res.status(200).send('Metrics received and stored');
      }
    } catch (error) {
      console.error('Error processing metrics:', error);
      res.status(500).send('Failed to process metrics');
    }
  }

  @Get()
  @RequiredCapability(Actions.READ)
  async findAll() {
    return this.metricsService.findAll();
  }

  @Get('ram')
  @RequiredCapability(Actions.READ)
  async getCpuUsage(@Query('ago') ago?: string) {
    return this.metricsService.getMemUsage(ago);
  }

  @Get('cpu')
  @RequiredCapability(Actions.READ)
  async getRamUsage(@Query('ago') ago?: string) {
    return this.metricsService.getCpuUsage(ago);
  }
}
