// user-utility.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class UserUtilityService {
  private authService: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async getUserDetails(userId: string): Promise<any> {
    const getUserRequest = { userId };

    try {
      const userResponse = await lastValueFrom(
        this.authService
          .getUserById(getUserRequest)
          .pipe(map((response) => response.userObj)),
      );
      return userResponse;
    } catch (err) {
      console.error('Error fetching user details', err);
      throw new Error('Unable to fetch user details');
    }
  }
}
