import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payroll_run')
export class PayrollRun {
  @PrimaryGeneratedColumn('uuid')
  runId!: string;

  @Column({ type: 'date' })
  periodStart!: Date;

  @Column({ type: 'date' })
  periodEnd!: Date;

  @Column({ type: 'text', default: 'pending' })
  status!: string; // pending | processing | completed | locked

  @Column({ type: 'timestamptz', nullable: true })
  generatedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
