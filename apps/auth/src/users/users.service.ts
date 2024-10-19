import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersDocument } from './models/users.schema';
import { UsersCreateDto } from './dto/users-create-dto';
import * as bcrypt from 'bcryptjs';
import { CurrentUserDto } from '@app/common';
import { UserLevels, UserTypes } from './user.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // ancestorIds is chain of all parents from top most to bottom most.
  // acountId will be equal to users._id if superadmin creates a partner or admin
  // acountId will be equal to users._id if parther creates admin.
  // accountId will be accountId of loggedIn user, if superadmin, partner or admin creats another account of same level, or enduser.
  // ie someone (loggedIn user) creates lover level account (but not enduser), the accountId will be the users._id of the created account
  async createUser(
    usersCreateDto: UsersCreateDto,
    loggedInUserId: string,
  ): Promise<UsersDocument> {
    await this.createUserValidateDto(usersCreateDto.email);
    let ancestorIds: string[] = [];
    let accountId: string;
    let newAccoutnId: boolean = false;

    const loggedInUser = await this.usersRepository.findById(loggedInUserId);
    if (!loggedInUser) {
      throw new Error('Parent not found');
    }

    if (!Array.isArray(loggedInUser.ancestor_ids)) {
      // throw new Error('parent.ancestor_ids is not an array'); // Ensure it's an array
      ancestorIds = [loggedInUser._id.toString()];
    } else {
      // Inherit parent's ancestor_ids and add parent's ID
      ancestorIds = [...loggedInUser.ancestor_ids, loggedInUser._id.toString()];
    }
    const toSaveUserType = usersCreateDto.u_type;
    const loggedInUserType = loggedInUser?.u_type
      ? loggedInUser.u_type
      : UserTypes.ENDUSER;
    const userTypeLevels = new UserLevels();
    //if enduser or similar level account then, accountId will be loggedInUser's accountId else createdUsers's _id
    if (
      toSaveUserType === UserTypes.ENDUSER ||
      userTypeLevels[toSaveUserType] === userTypeLevels[loggedInUserType]
    ) {
      accountId = loggedInUser?.accountId ? loggedInUser.accountId : null;
    } else if (
      userTypeLevels[toSaveUserType] < userTypeLevels[loggedInUserType]
    ) {
      newAccoutnId = true;
    } else {
      throw new Error('The selection of the UserType (u_type) is not allowd');
    }

    let createdUser = await this.usersRepository.create({
      ...usersCreateDto,
      password: await bcrypt.hash(usersCreateDto.password, 10),
      parent_id: loggedInUserId || null, // ie owner_id
      added_by: loggedInUserId || null, // this can be different from parent_id, in case if someone else on behalf of the parent_id/owner_id adds/edits the record
      ancestor_ids: ancestorIds,
      accountId,
    });

    if (newAccoutnId) {
      createdUser = await this.usersRepository.findOneAndUpdate(
        { _id: createdUser._id },
        { accountId: createdUser._id },
      );
    }
    return createdUser;
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
      const userVal: CurrentUserDto = {
        userId: user._id.toHexString(),
        email: user.email,
      };
      return userVal;
    }
  }

  async updateUserHierarchy(
    userId: string,
    newParentId: string,
  ): Promise<void> {
    const newParent = await this.usersRepository.findById(newParentId);
    if (!newParent) {
      throw new Error('New parent not found');
    }

    // Fetch the user and update their ancestor_ids
    const user = await this.usersRepository.findById(userId);
    const newAncestorIds = [
      ...newParent.ancestor_ids,
      newParent._id.toString(),
    ];
    await this.usersRepository.findOneAndUpdate(
      { _id: userId },
      { ancestor_ids: newAncestorIds },
    );

    // Recursively update all descendants' ancestor_ids
    await this.updateDescendantAncestors(userId, newAncestorIds);

    // Update products owned by the user
    await this.usersRepository.findManyAndUpdate(
      { parent_id: userId },
      { ancestor_ids: newAncestorIds },
    );
  }

  // Recursively update all descendants
  private async updateDescendantAncestors(
    userId: string,
    newAncestorIds: string[],
  ): Promise<void> {
    const descendants = await this.usersRepository.find({
      ancestor_ids: userId,
    });
    for (const descendant of descendants) {
      const updatedAncestorIds = [...newAncestorIds, descendant._id.toString()];
      await this.usersRepository.findOneAndUpdate(
        { _id: descendant._id },
        { ancestor_ids: updatedAncestorIds },
      );

      // Update products owned by the descendant
      //******************* DO THIS BY SENDING EVENTS TO PRODUCT/OTHER MICROSERVICES */
      /*await this.productRepository.updateMany(
        { owner_id: descendant._id },
        { ancestor_ids: updatedAncestorIds },
      );*/

      // Recursively update descendants of the current descendant
      await this.updateDescendantAncestors(
        descendant._id.toString(),
        updatedAncestorIds,
      );
    }
  }
}
