import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
  exports: [RecruitmentService],
})
export class RecruitmentModule {}
