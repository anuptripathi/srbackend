import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule, UserTypeContorl } from '@app/common';
import { CapabilityService } from './capability.service';
import { RoleDocument, RoleSchema } from '../roles/role.schema';
import { AuthGrpcClientsModule } from '@app/common/grpc_clients';
import { RolesRepository } from '../roles/roles.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: RoleDocument.name, schema: RoleSchema },
    ]),
    LoggerModule,
    AuthGrpcClientsModule,
  ],
  providers: [CapabilityService, RolesRepository],
  exports: [CapabilityService],
})
export class CapabilityModule {}
