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
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CurrentUser, CurrentUserDto, JwtAuthGaurd } from '@app/common';

@Controller('srmain')
export class SrmainController {
  constructor(private readonly srmainService: SrmainService) {}

  @Post()
  @UseGuards(JwtAuthGaurd)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.srmainService.create(createReservationDto, user);
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
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.srmainService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGaurd)
  async remove(@Param('id') id: string) {
    return this.srmainService.remove(id);
  }
}
