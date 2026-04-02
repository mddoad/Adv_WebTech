import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  send(@Body() body: { studentName: string; message: string }) {
    const { studentName, message } = body;
    return this.notificationService.sendNotification(studentName, message);
  }

  @Post('check')
  check(@Body() body: { studentName: string; courseId: string }) {
    const { studentName, courseId } = body;
    return this.notificationService.checkEnrollmentAndNotify(studentName, courseId);
  }
}