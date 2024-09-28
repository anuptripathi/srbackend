import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import {
  CurrentUserDto,
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentService: PaymentsServiceClient;
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly paymentClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService = this.paymentClient.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }
  async create(
    createReservationDto: CreateReservationDto,
    user: CurrentUserDto,
  ) {
    return this.paymentService
      .createCharge({
        ...createReservationDto.charge,
        email: user.email,
      })
      .pipe(
        map((res) => {
          return this.reservationRepository.create({
            ...createReservationDto,
            timestamp: new Date(),
            invoiceId: res.id,
            userId: user.userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
