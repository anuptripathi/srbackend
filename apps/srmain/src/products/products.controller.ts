import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { of } from 'rxjs';
import {
  CurrentUser,
  CurrentUserDto,
  JwtAuthGaurd,
  Subjects,
  Subject,
  RequiredCapability,
  Actions,
  CapabilityGuard,
} from '@app/common';

@Controller(Subjects.PRODUCTS)
@Subject(Subjects.PRODUCTS)
@UseGuards(JwtAuthGaurd, CapabilityGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequiredCapability(Actions.ADD)
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @RequiredCapability(Actions.READ)
  async findAll(
    @CurrentUser() user,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    console.log('LLLLLLLLLLL', limit, offset);
    return this.productsService.findAll(user, limit, offset);
  }

  @Get(':id')
  @RequiredCapability(Actions.READ)
  async findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.productsService.findOne(id, user);
  }

  @Patch(':id')
  @RequiredCapability(Actions.EDIT)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @RequiredCapability(Actions.DELETE)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
