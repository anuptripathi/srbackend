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
      accountId: user.accountId,
      partnerId: user.partnerId,
    });
  }

  //The lastId here can be either document-id or offset.
  async findAll(user: CurrentUserDto, limit: number = 10, offset: number = 0) {
    const ownershipCondition =
      this.productsRepository.getOwnershipCondition(user);
    const data = await this.productsRepository.find(
      ownershipCondition,
      limit,
      offset,
    );
    const estimatedCount =
      await this.productsRepository.estimatedDocumentCount();

    if (estimatedCount <= 10000) {
      const totalRecords =
        await this.productsRepository.countDocuments(ownershipCondition);
      return { data, totalRecords, cursorBased: false };
    } else {
      return { data, cursorBased: true };
    }
  }

  async findOne(_id: string, user: CurrentUserDto) {
    const ownershipCondition =
      this.productsRepository.getOwnershipCondition(user);
    return this.productsRepository.findOne({ _id, ...ownershipCondition });
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
