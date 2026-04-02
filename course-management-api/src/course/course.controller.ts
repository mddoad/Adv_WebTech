import {
 Controller,
 Get,
 Post,
 Put,
 Patch,
 Delete,
 Param,
 Body,
 UseInterceptors,
 UploadedFile
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {

 constructor(private readonly courseService: CourseService) {}

 @Get()
 getAllCourses() {
  return this.courseService.getAllCourses();
 }

 @Get(':id')
 getCourseById(@Param('id') id: string) {
  return this.courseService.getCourseById(id);
 }

 @Post()
 createCourse(@Body() dto: CreateCourseDto) {
  return this.courseService.createCourse(dto);
 }

 @Put(':id')
 updateCourse(
  @Param('id') id: string,
  @Body() dto: UpdateCourseDto
 ) {
  return this.courseService.updateCourse(id, dto);
 }

 @Patch(':id')
 patchCourse(
  @Param('id') id: string,
  @Body() dto: UpdateCourseDto
 ) {
  return this.courseService.patchCourse(id, dto);
 }

 @Delete(':id')
 deleteCourse(@Param('id') id: string) {
  return this.courseService.deleteCourse(id);
 }

 @Post(':id/upload')
 @UseInterceptors(
  FileInterceptor('file', {
   storage: diskStorage({
    destination: './src/uploads',
    filename: (req, file, cb) => {
     const uniqueName = Date.now() + extname(file.originalname);
     cb(null, uniqueName);
    }
   }),
   limits: {
    fileSize: 2 * 1024 * 1024
   },
   fileFilter: (req, file, cb) => {

    const allowed = /jpg|jpeg|png|pdf/;

    const ext = allowed.test(extname(file.originalname).toLowerCase());

    if (ext) {
     cb(null, true);
    } else {
     cb(new Error('Only JPG, PNG, PDF files allowed'), false);
    }
   }
  })
 )
 uploadFile(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File
 ) {
  return this.courseService.uploadCourseMaterial(id, file);
 }

}