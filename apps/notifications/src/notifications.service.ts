import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendEmail(data: any) {
    console.log(
      'Sending email to: ',
      data.email,
      'for charged amount: ',
      data.amount,
    );
  }
}
