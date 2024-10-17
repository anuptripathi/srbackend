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
import { CentralService } from './central.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CurrentUser, CurrentUserDto, JwtAuthGaurd } from '@app/common';

@Controller('central')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Post()
  @UseGuards(JwtAuthGaurd)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.centralService.create(createReservationDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGaurd)
  async findAll() {
    console.log('Show the result. Now Got the all rese..................');
    return this.centralService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGaurd)
  async findOne(@Param('id') id: string) {
    return this.centralService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGaurd)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.centralService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGaurd)
  async remove(@Param('id') id: string) {
    return this.centralService.remove(id);
  }
}
