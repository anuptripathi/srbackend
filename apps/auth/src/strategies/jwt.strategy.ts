import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { CurrentUserDto } from '@app/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return (
            request?.cookies?.Authentication ||
            request?.Authentication ||
            request?.headers?.Authentication
          );
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(tokenPayload: CurrentUserDto) {
    try {
      //console.log('tokenPayloadtokenPayloadtokenPayload', tokenPayload);
      //return await this.userService.getUser({ _id: tokenPayload.userId });
      return tokenPayload;
    } catch (e) {
      throw new UnauthorizedException('Invalid user');
    }
  }
}
