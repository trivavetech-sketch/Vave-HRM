import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
  ) {}

  async findAll(page = 1, limit = 20): Promise<{ items: Employee[]; total: number }> {
    const [items, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total };
  }

  async findById(id: string): Promise<Employee> {
    const emp = await this.repo.findOne({ where: { employeeId: id } });
    if (!emp) throw new NotFoundException(`Employee ${id} not found`);
    return emp;
  }

  async create(data: CreateEmployeeDto): Promise<Employee> {
    const emp = this.repo.create(data);
    return this.repo.save(emp);
  }

  async update(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    await this.findById(id);
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    const emp = await this.findById(id);
    emp.status = 'terminated';
    await this.repo.save(emp);
  }
}
