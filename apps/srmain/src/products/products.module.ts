import { AuthGrpcClientsModule } from '@app/common/grpc_clients';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { LoggerModule, DatabaseModule } from '@app/common';
import { ProductDocument, ProductSchema } from './product.schema';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ProductDocument.name, schema: ProductSchema },
    ]),
    LoggerModule,
    AuthGrpcClientsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
