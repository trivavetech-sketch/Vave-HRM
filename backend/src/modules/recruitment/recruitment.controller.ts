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
import { RecruitmentService } from './recruitment.service';
import { Candidate } from './entities/candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Controller('candidates')
// @UseGuards(AuthGuard('jwt')) // Temporarily disabled for MVP testing
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get()
  findAll(@Query('status') status?: string): Promise<Candidate[]> {
    return this.recruitmentService.findAll(status);
  }

  @Post()
  create(@Body() body: CreateCandidateDto): Promise<Candidate> {
    return this.recruitmentService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<Candidate>,
  ): Promise<Candidate> {
    return this.recruitmentService.update(id, body);
  }
}
