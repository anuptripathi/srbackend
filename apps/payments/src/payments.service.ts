import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly notificationsClient: ClientGrpc,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.getOrThrow('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-06-20',
    },
  );

  async createCharge({ email, amount }: PaymentsCreateChargeDto) {
    /*const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card,
    });*/
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    if (!this.notificationsService) {
      this.notificationsService =
        this.notificationsClient.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
    }

    this.notificationsService
      .notifyEmail({ email, amount })
      .subscribe((response) => {
        console.log(response);
      });
    return paymentIntent;
  }
}
