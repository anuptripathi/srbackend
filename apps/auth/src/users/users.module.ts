import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersDocument, UsersSchema } from './users.schema';
import { DatabaseModule, LoggerModule, UserTypeContorl } from '@app/common';
import { UsersRepository } from './users.repository';
import { CapabilityModule } from '../capability/capability.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UsersDocument.name, schema: UsersSchema },
    ]),
    LoggerModule,
    CapabilityModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserTypeContorl],
  exports: [UsersService],
})
export class UsersModule {}
