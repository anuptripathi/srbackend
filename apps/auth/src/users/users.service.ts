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

  async createUser(
    usersCreateDto: UsersCreateDto,
    parentId?: string,
  ): Promise<UsersDocument> {
    await this.createUserValidateDto(usersCreateDto.email);
    let ancestorIds: string[] = [];

    // If the user has a parent, inherit the parent's ancestor_ids and add the parent ID
    if (parentId) {
      const parent = await this.usersRepository.findById(parentId);
      if (!parent) {
        throw new Error('Parent not found');
      }

      if (!Array.isArray(parent.ancestor_ids)) {
        // throw new Error('parent.ancestor_ids is not an array'); // Ensure it's an array
        ancestorIds = [parent._id.toString()];
      } else {
        // Inherit parent's ancestor_ids and add parent's ID
        ancestorIds = [...parent.ancestor_ids, parent._id.toString()];
      }
    }

    return this.usersRepository.create({
      ...usersCreateDto,
      password: await bcrypt.hash(usersCreateDto.password, 10),
      parent_id: parentId || null, //this is owner_id, that can be different from logged user, for a swithed account.
      added_by: parentId || null,
      ancestor_ids: ancestorIds,
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
