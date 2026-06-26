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

@Controller('attendance')
@UseGuards(AuthGuard('jwt'))
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

  @Post()
  create(@Body() body: Partial<Attendance>): Promise<Attendance> {
    return this.attendanceService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Attendance>): Promise<Attendance> {
    return this.attendanceService.update(id, body);
  }
}
