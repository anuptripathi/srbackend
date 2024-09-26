import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersDocument } from './models/users.schema';
import { UsersCreateDto } from './dto/users-create-dto';
import * as bcrypt from 'bcryptjs';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(usersCreateDto: UsersCreateDto): Promise<UsersDocument> {
    await this.createUserValidateDto(usersCreateDto.email);
    return this.usersRepository.create({
      ...usersCreateDto,
      password: await bcrypt.hash(usersCreateDto.password, 10),
    });
  }

  private async createUserValidateDto(email: string) {
    try {
      const user = await this.usersRepository.findOne({ email });
    } catch (e) {
      return;
    }
    throw new UnprocessableEntityException('Email does alreay exist');
  }

  async getUser(userObj) {
    try {
      const user = await this.usersRepository.findOne(userObj);
      return user;
    } catch (e) {
      throw new UnprocessableEntityException('User does alreay exist');
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not vlaid');
    } else {
      const userVal: TokenPayload = {
        userId: user._id.toHexString(),
        email: user.email,
      };
      return userVal;
    }
  }
}
