import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
// @UseGuards(AuthGuard('jwt')) // Temporarily disabled for MVP testing
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.employeeService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.findById(id);
  }

  @Post()
  create(@Body() body: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateEmployeeDto): Promise<Employee> {
    return this.employeeService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.employeeService.softDelete(id);
  }
}
