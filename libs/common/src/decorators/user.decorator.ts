import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from '../dtos/users.dto';

const getUserByContext = (context: ExecutionContext): CurrentUserDto => {
  return context.switchToHttp().getRequest().user;
};
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getUserByContext(context),
);
