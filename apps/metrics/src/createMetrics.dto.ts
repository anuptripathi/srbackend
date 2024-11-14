import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateMetricsDto {
  name: string;

  timestamp: number;

  tags: Record<string, string>;

  fields: Record<string, number>;
}
