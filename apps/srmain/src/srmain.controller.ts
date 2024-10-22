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

@Controller(Subjects.PRODUCTS)
@Subject(Subjects.PRODUCTS)
@UseGuards(JwtAuthGaurd, CapabilityGuard)
export class SrmainController {
  constructor(private readonly srmainService: SrmainService) {}

  @Post()
  @RequiredCapability(Actions.ADD)
  async create(
    @Body() createSrmainDto: CreateSrmainDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.srmainService.create(createSrmainDto, user);
  }

  @Get()
  @RequiredCapability(Actions.READ)
  async findAll() {
    console.log('Show the result. Now Got the all rese..................');
    return this.srmainService.findAll();
  }

  @Get(':id')
  @RequiredCapability(Actions.READ)
  async findOne(@Param('id') id: string) {
    return this.srmainService.findOne(id);
  }

  @Patch(':id')
  @RequiredCapability(Actions.EDIT)
  async update(
    @Param('id') id: string,
    @Body() updateSrmainDto: UpdateSrmainDto,
  ) {
    return this.srmainService.update(id, updateSrmainDto);
  }

  @Delete(':id')
  @RequiredCapability(Actions.DELETE)
  async remove(@Param('id') id: string) {
    return this.srmainService.remove(id);
  }
}
