import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Request, Response } from 'express';

@Controller()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getHello(): string {
    return this.metricsService.getHello();
  }

  @Post('telegraf')
  async receiveTelegrafMetrics(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const metrics = JSON.parse(req.body);
      console.log(
        'Received Telegraf Metrics:',
        JSON.stringify(metrics, null, 2),
      );

      // Process metrics as needed
      // You can save them to a database or trigger other services

      res.status(200).send('Metrics received');
    } catch (error) {
      console.error('Error processing metrics:', error);
      res.status(500).send('Failed to process metrics');
    }
  }
}
