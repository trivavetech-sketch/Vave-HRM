import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
  ) {}

  async findAll(employeeId?: string, from?: Date, to?: Date): Promise<Attendance[]> {
    const whereClause: any = {};
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }
    if (from && to) {
      whereClause.checkIn = Between(from, to);
    }
    return this.repo.find({
      where: whereClause,
      order: { checkIn: 'DESC' },
      relations: ['employee'],
    });
  }

  async findById(id: string): Promise<Attendance> {
    const record = await this.repo.findOne({ where: { attendanceId: id } });
    if (!record) throw new NotFoundException(`Attendance record ${id} not found`);
    return record;
  }

  async checkIn(data: CreateAttendanceDto): Promise<Attendance> {
    const record = this.repo.create({
      ...data,
      checkIn: new Date(),
      status: 'On Time', // Can be calculated based on shift
    });
    return this.repo.save(record);
  }

  async update(id: string, data: Partial<Attendance>): Promise<Attendance> {
    await this.findById(id);
    await this.repo.update(id, data);
    return this.findById(id);
  }
}
