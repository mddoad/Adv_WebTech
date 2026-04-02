import { Body, Controller, Get, Post } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  getEnrollments() {
    return this.enrollmentService.getEnrollments();
  }

  @Post()
  enrollStudent(@Body() body: { studentName: string; courseId: string }) {
    const { studentName, courseId } = body;
    return this.enrollmentService.enrollStudent(studentName, courseId);
  }
}