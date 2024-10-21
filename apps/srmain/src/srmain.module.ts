import { Module } from '@nestjs/common';
import { SrmainService } from './srmain.service';
import { SrmainController } from './srmain.controller';
import {
  DatabaseModule,
  LoggerModule,
  HealthModule,
  UserTypeContorl,
} from '@app/common';
import { SrmainRepository } from './srmain.repository';
import { SrmainDocument, SrmainSchema } from './models/srmain.schema';
import { ConfigModule } from '@nestjs/config';
import {
  AuthGrpcClientsModule,
  PaymentGrpcClientsModule,
} from '@app/common/grpc_clients';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: SrmainDocument.name, schema: SrmainSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthGrpcClientsModule,
    PaymentGrpcClientsModule,
    HealthModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [SrmainController],
  providers: [SrmainService, SrmainRepository, UserTypeContorl],
})
export class SrmainModule {}
