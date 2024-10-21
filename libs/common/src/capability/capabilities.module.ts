// capabilities.module.ts
import { Module } from '@nestjs/common';
import { CapabilityGuard } from './capability.guard';
import { APP_GUARD } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { AuthGrpcClientsModule } from '../grpc_clients';

@Module({
  imports: [AuthGrpcClientsModule],
  providers: [
    Reflector,
    CapabilityGuard,
    {
      provide: APP_GUARD,
      useClass: CapabilityGuard,
    },
  ],
  exports: [CapabilityGuard],
})
export class CapabilitiesModule {}
