import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCandidateDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  status?: string; // applied | interview | offer | hired | rejected
}
