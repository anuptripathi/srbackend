import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule, UserTypeContorl } from '@app/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { RoleDocument, RoleSchema } from './role.schema';
import { AuthGrpcClientsModule } from '@app/common/grpc_clients';
import { UsersModule } from '../users/users.module';
import { CapabilityModule } from '../capability/capability.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: RoleDocument.name, schema: RoleSchema },
    ]),
    LoggerModule,
    AuthGrpcClientsModule,
    UsersModule,
    CapabilityModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, UserTypeContorl],
  exports: [RolesService],
})
export class RolesModule {}
