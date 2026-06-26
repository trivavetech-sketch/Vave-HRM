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
import { PayrollService } from './payroll.service';
import { PayrollRun } from './entities/payroll-run.entity';

@Controller('payroll/runs')
@UseGuards(AuthGuard('jwt'))
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  findAll(@Query('period') period?: string): Promise<PayrollRun[]> {
    return this.payrollService.findAll(period);
  }

  @Post()
  create(@Body() body: Partial<PayrollRun>): Promise<PayrollRun> {
    return this.payrollService.create(body);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<PayrollRun> {
    return this.payrollService.updateStatus(id, status);
  }
}
