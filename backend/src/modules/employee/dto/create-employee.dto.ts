import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString, IsIn } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  dept?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsNotEmpty()
  @IsDateString()
  hireDate!: string;

  @IsOptional()
  @IsIn(['Active', 'Probation', 'Terminated'])
  status?: string;
}
