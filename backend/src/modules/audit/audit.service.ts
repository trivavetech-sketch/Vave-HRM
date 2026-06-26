import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(data: Partial<AuditLog>): Promise<AuditLog> {
    const entry = this.repo.create(data);
    return this.repo.save(entry);
  }

  async findByRecord(tableName: string, recordId: string): Promise<AuditLog[]> {
    return this.repo.find({
      where: { tableName, recordId },
      order: { createdAt: 'DESC' },
    });
  }
}
