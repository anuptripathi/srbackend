import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  NotificationsServiceController,
  NotificationsServiceControllerMethods,
} from '@app/common';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController {
  constructor(private readonly notificationsService: NotificationsService) {}

  async notifyEmail(data: any) {
    this.notificationsService.sendEmail(data);
  }
}
