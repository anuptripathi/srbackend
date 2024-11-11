import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersDocument, UsersSchema } from './users.schema';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UsersRepository } from './users.repository';
import { CapabilityModule } from '../capability/capability.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UsersDocument.name, schema: UsersSchema },
    ]),
    LoggerModule,
    CapabilityModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.getOrThrow<string>('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined');
        }
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${configService.getOrThrow('JWT_EXPIRATION')}s`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
