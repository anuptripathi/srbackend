import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationClient: ClientProxy,
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

    this.notificationClient
      .send('notifiy_on_email', { email, amount })
      .subscribe((response) => {
        console.log(response);
      });
    return paymentIntent;
  }
}
