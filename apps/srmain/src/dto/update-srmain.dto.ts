import { PartialType } from '@nestjs/mapped-types';
import { CreateSrmainDto } from './create-srmain.dto';

export class UpdateSrmainDto extends PartialType(CreateSrmainDto) {}
