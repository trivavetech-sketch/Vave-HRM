import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PayrollRun } from './entities/payroll-run.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(PayrollRun)
    private readonly repo: Repository<PayrollRun>,
    @InjectQueue('payroll') private readonly payrollQueue: Queue,
  ) {}

  async findAll(period?: string): Promise<PayrollRun[]> {
    const where: any = {};
    // simple period filter if needed
    return this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<PayrollRun> {
    const run = await this.repo.findOne({ where: { runId: id } });
    if (!run) throw new NotFoundException(`Payroll run ${id} not found`);
    return run;
  }

  async create(data: Partial<PayrollRun>): Promise<PayrollRun> {
    const run = this.repo.create(data);
    const saved = await this.repo.save(run);

    // Queue the heavy calculations asynchronously
    await this.payrollQueue.add('calculate-payroll', {
      runId: saved.runId,
    });

    return saved;
  }

  async updateStatus(id: string, status: string): Promise<PayrollRun> {
    const run = await this.findById(id);
    run.status = status;
    if (status === 'completed') {
      run.generatedAt = new Date();
    }
    return this.repo.save(run);
  }
}
