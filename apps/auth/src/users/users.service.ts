import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersDocument } from './users.schema';
import { UsersCreateDto } from './dto/users-create-dto';
import * as bcrypt from 'bcryptjs';
import { CurrentUserDto } from '@app/common';
import { UserLevels, UserTypes } from './user.types';
import { UsersUpdateDto } from './dto/users-update-dto';

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

    if (!Array.isArray(loggedInUser.ancestorIds)) {
      // throw new Error('parent.ancestor_ids is not an array'); // Ensure it's an array
      ancestorIds = [loggedInUser._id.toString()];
    } else {
      // Inherit parent's ancestor_ids and add parent's ID
      ancestorIds = [...loggedInUser.ancestorIds, loggedInUser._id.toString()];
    }
    const toSaveUserType = usersCreateDto.uType;
    const loggedInUserType = loggedInUser?.uType
      ? loggedInUser.uType
      : UserTypes.ENDUSER;
    const userTypeLevels = new UserLevels();

    if (userTypeLevels[toSaveUserType] > userTypeLevels[loggedInUserType]) {
      throw new UnprocessableEntityException(
        'Logged user has no capability to create a user of greater.',
      );
    }

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
      throw new UnprocessableEntityException(
        'The selection of the UserType (uType) is not allowd',
      );
    }

    if (
      loggedInUserType === UserTypes.PARTNER &&
      userTypeLevels[toSaveUserType] >= userTypeLevels[UserTypes.PARTNER]
    ) {
      throw new UnprocessableEntityException(
        'Partner cant create users greater than or equal to his/her level.',
      );
    }
    let partnerId = loggedInUserId;
    if (userTypeLevels[loggedInUserType] < userTypeLevels[UserTypes.PARTNER]) {
      //ie admin/enduser
      partnerId = loggedInUser.partnerId;
    }

    let createdUser = await this.usersRepository.create({
      ...usersCreateDto,
      password: await bcrypt.hash(usersCreateDto.password, 10),
      ownerId: loggedInUserId || null, // ie parentId
      addedBy: loggedInUserId || null, // this can be different from ownerId, in case if someone else on behalf of the ownerId/parentId adds/edits the record
      ancestorIds: ancestorIds,
      accountId,
      partnerId,
    });

    if (newAccoutnId) {
      createdUser = await this.usersRepository.findOneAndUpdate(
        { _id: createdUser._id },
        { accountId: createdUser._id },
      );
    }
    return createdUser;
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async updateUser(
    userDto: UsersUpdateDto,
    loggedInUser: CurrentUserDto,
  ): Promise<UsersDocument> {
    await this.updateUserValidateDto(userDto.email, loggedInUser.email);

    let updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: loggedInUser.userId },
      {
        ...userDto,
      },
    );

    return updatedUser;
  }

  private async createUserValidateDto(email: string) {
    try {
      const user = await this.usersRepository.findOne({ email });
    } catch (e) {
      return;
    }
    throw new UnprocessableEntityException('Email does alreay exist');
  }

  private async updateUserValidateDto(
    dtoEmail: string,
    loggedInUserEmail: string,
  ) {
    try {
      const user = await this.usersRepository.findOne({
        $and: [
          { email: dtoEmail }, // Check for the dtoEmail
          { email: { $ne: loggedInUserEmail } }, // Exclude logged-in user's email
        ],
      });

      if (user) {
        throw new UnprocessableEntityException('Email already exists');
      }
    } catch (e) {
      if (e.status === 404) {
        return true;
      }
      throw new UnprocessableEntityException(
        'An error occurred while validating the email',
        e,
      );
    }
  }

  async getUser(userObj) {
    try {
      const user = await this.usersRepository.findOne(userObj);
      return user;
    } catch (e) {
      throw new UnprocessableEntityException('User does alreay exist');
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.usersRepository.findOne({ _id: userId });
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
        uType: user?.uType,
        accountId: user?.accountId,
        roleId: user?.roleId,
        partnerId: user?.partnerId,
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
    const newAncestorIds = [...newParent.ancestorIds, newParent._id.toString()];
    await this.usersRepository.findOneAndUpdate(
      { _id: userId },
      { ancestor_ids: newAncestorIds },
    );

    // Recursively update all descendants' ancestor_ids
    await this.updateDescendantAncestors(userId, newAncestorIds);

    // Update products owned by the user
    await this.usersRepository.findManyAndUpdate(
      { ownerId: userId },
      { ancestor_ids: newAncestorIds },
    );
  }

  // Recursively update all descendants
  private async updateDescendantAncestors(
    userId: string,
    newAncestorIds: string[],
  ): Promise<void> {
    const descendants = await this.usersRepository.find({
      ancestorIds: userId,
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
