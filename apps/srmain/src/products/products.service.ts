import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { CurrentUserDto } from '@app/common';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto, user: CurrentUserDto) {
    return this.productsRepository.create({
      ...createProductDto,
      addedBy: user.userId,
      ownerId: user.userId,
      ancestorIds: [],
    });
  }

  async findAll() {
    return this.productsRepository.find({});
  }

  async findOne(_id: string) {
    return this.productsRepository.findOne({ _id });
  }

  async update(_id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.findOneAndUpdate(
      { _id },
      { $set: updateProductDto },
    );
  }

  async remove(_id: string) {
    return this.productsRepository.findOneAndDelete({ _id });
  }
}