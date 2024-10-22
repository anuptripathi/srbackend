import { AuthGrpcClientsModule } from '@app/common/grpc_clients';
import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { LoggerModule, DatabaseModule, UserTypeContorl } from '@app/common';
import { PermissionDocument, PermissionSchema } from './permission.schema';
import { PermissionsRepository } from './permissions.repository';
import { CapabilityModule } from '../capability/capability.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: PermissionDocument.name, schema: PermissionSchema },
    ]),
    LoggerModule,
    AuthGrpcClientsModule,
    CapabilityModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository, UserTypeContorl],
})
export class PermissionsModule {}
