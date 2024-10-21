export interface CurrentUserDto {
  userId: string;
  email: string;
  uType: string;
  accountId: string; // top parent (kind of main account owner)
  roleId: string;
}
