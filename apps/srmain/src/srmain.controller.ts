import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SrmainService } from './srmain.service';
import { CreateSrmainDto } from './dto/create-srmain.dto';
import { UpdateSrmainDto } from './dto/update-srmain.dto';
import { CurrentUser, CurrentUserDto, JwtAuthGaurd } from '@app/common';

@Controller('srmain')
export class SrmainController {
  constructor(private readonly srmainService: SrmainService) {}

  @Post()
  @UseGuards(JwtAuthGaurd)
  async create(
    @Body() createSrmainDto: CreateSrmainDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.srmainService.create(createSrmainDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGaurd)
  async findAll() {
    console.log('Show the result. Now Got the all rese..................');
    return this.srmainService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGaurd)
  async findOne(@Param('id') id: string) {
    return this.srmainService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGaurd)
  async update(
    @Param('id') id: string,
    @Body() updateSrmainDto: UpdateSrmainDto,
  ) {
    return this.srmainService.update(id, updateSrmainDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGaurd)
  async remove(@Param('id') id: string) {
    return this.srmainService.remove(id);
  }
}
