import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
// @UseGuards(AuthGuard('jwt')) // Temporarily disabled for MVP testing
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.attendanceService.findAll(employeeId, fromDate, toDate);
  }

  @Post('check-in')
  checkIn(@Body() body: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceService.checkIn(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Attendance>): Promise<Attendance> {
    return this.attendanceService.update(id, body);
  }
}
