import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectRepository(Candidate)
    private readonly repo: Repository<Candidate>,
  ) {}

  async findAll(status?: string): Promise<Candidate[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Candidate> {
    const candidate = await this.repo.findOne({ where: { candidateId: id } });
    if (!candidate) throw new NotFoundException(`Candidate ${id} not found`);
    return candidate;
  }

  async create(data: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.repo.create(data);
    return this.repo.save(candidate);
  }

  async update(id: string, data: Partial<Candidate>): Promise<Candidate> {
    await this.findById(id);
    await this.repo.update(id, data);
    return this.findById(id);
  }
}
