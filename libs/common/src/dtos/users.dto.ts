export interface CurrentUserDto {
  userId: string;
  email: string;
  u_type: string;
  accountId: string; // top parent (kind of main account owner)
}
