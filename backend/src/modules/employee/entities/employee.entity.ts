import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  employeeId!: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  orgId?: string;

  @Column({ type: 'uuid', nullable: true })
  branchId?: string;

  @Column({ type: 'uuid', nullable: true })
  deptId?: string;

  @Column({ type: 'uuid', nullable: true })
  desigId?: string;

  @Column({ type: 'text' })
  firstName!: string;

  @Column({ type: 'text' })
  lastName!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'date' })
  hireDate!: Date;

  @Column({ type: 'text', default: 'active' })
  status!: string; // active | probation | terminated

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
