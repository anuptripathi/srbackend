import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSrmainDto } from './dto/create-srmain.dto';
import { UpdateSrmainDto } from './dto/update-srmain.dto';
import { SrmainRepository } from './srmain.repository';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CurrentUserDto,
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class SrmainService implements OnModuleInit {
  private paymentService: PaymentsServiceClient;
  private authService: AuthServiceClient;
  constructor(
    private readonly srmainRepository: SrmainRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly paymentClient: ClientGrpc,
    @Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService = this.paymentClient.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
  async create(createSrmainDto: CreateSrmainDto, user: CurrentUserDto) {
    const getUserRequest = { userId: user.userId };

    const userResponse = await lastValueFrom(
      this.authService
        .getUserById(getUserRequest)
        .pipe(map((response) => response.userObj)),
    );
    console.log('userResponse', userResponse);

    return this.paymentService
      .createCharge({
        ...createSrmainDto.charge,
        email: user.email,
      })
      .pipe(
        map((res) => {
          return this.srmainRepository.create({
            ...createSrmainDto,
            timestamp: new Date(),
            invoiceId: res.id,
            ownerId: user.userId,
            addedBy: user.userId,
            ancestorIds: userResponse.ancestorIds,
          });
        }),
      );
  }

  async findAll() {
    return this.srmainRepository.find({});
  }

  async findOne(_id: string) {
    return this.srmainRepository.findOne({ _id });
  }

  async update(_id: string, updateSrmainDto: UpdateSrmainDto) {
    return this.srmainRepository.findOneAndUpdate(
      { _id },
      { $set: updateSrmainDto },
    );
  }

  async remove(_id: string) {
    return this.srmainRepository.findOneAndDelete({ _id });
  }
}
