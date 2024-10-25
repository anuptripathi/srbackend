import { AbstractRepository } from '@app/common';
import { ProductDocument } from './product.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsRepository extends AbstractRepository<ProductDocument> {
  protected readonly logger = new Logger(ProductsRepository.name);

  constructor(
    @InjectModel(ProductDocument.name) productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }
}
