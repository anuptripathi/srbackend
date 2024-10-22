import { Module, Global } from '@nestjs/common';
import { UserUtilityService } from './user-utility.service';
import { AuthGrpcClientsModule } from '@app/common/grpc_clients';

@Module({
  imports: [AuthGrpcClientsModule],
  providers: [UserUtilityService],
  exports: [UserUtilityService],
})
export class UilityModule {}
