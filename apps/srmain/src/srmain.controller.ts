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
  RequiredUserType,
  JwtAuthGaurd,
  UserTypeGuard,
  UserTypes,
  Subject,
  CapabilityGuard,
  RequiredCapability,
  Subjects,
  Actions,
} from '@app/common';

@Controller(Subjects.PRODUCTS)
@Subject(Subjects.PRODUCTS)
@RequiredUserType(UserTypes.ENDUSER)
@RequiredCapability(Actions.READ)
@UseGuards(JwtAuthGaurd, UserTypeGuard, CapabilityGuard)
export class SrmainController {
  constructor(private readonly srmainService: SrmainService) {}

  @Post()
  @RequiredUserType(UserTypes.ADMIN)
  @RequiredCapability(Actions.ADD)
  async create(
    @Body() createSrmainDto: CreateSrmainDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.srmainService.create(createSrmainDto, user);
  }

  @Get() // capabililty already applied on top
  async findAll() {
    console.log('Show the result. Now Got the all rese..................');
    return this.srmainService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.srmainService.findOne(id);
  }

  @Patch(':id')
  @RequiredUserType(UserTypes.ADMIN)
  @RequiredCapability(Actions.EDIT)
  async update(
    @Param('id') id: string,
    @Body() updateSrmainDto: UpdateSrmainDto,
  ) {
    return this.srmainService.update(id, updateSrmainDto);
  }

  @Delete(':id')
  @RequiredUserType(UserTypes.ADMIN)
  @RequiredCapability(Actions.DELETE)
  async remove(@Param('id') id: string) {
    return this.srmainService.remove(id);
  }
}
