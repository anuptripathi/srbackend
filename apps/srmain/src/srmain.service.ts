import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateSrmainDto } from './dto/create-srmain.dto';
import { UpdateSrmainDto } from './dto/update-srmain.dto';
import { SrmainRepository } from './srmain.repository';
import {
  CurrentUserDto,
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class SrmainService implements OnModuleInit {
  private paymentService: PaymentsServiceClient;
  constructor(
    private readonly srmainRepository: SrmainRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly paymentClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService = this.paymentClient.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }
  async create(createSrmainDto: CreateSrmainDto, user: CurrentUserDto) {
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
            userId: user.userId,
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
