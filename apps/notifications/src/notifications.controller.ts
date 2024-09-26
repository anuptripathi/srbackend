import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('notifiy_on_email')
  async notifyOnEmail(@Payload() data) {
    this.notificationsService.sendEmail(data);
  }
}
