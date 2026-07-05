import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  attendanceId!: string;

  @Column({ type: 'uuid' })
  employeeId!: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId', referencedColumnName: 'employeeId' })
  employee!: Employee;

  @Column({ type: 'timestamptz', nullable: true })
  checkIn?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  checkOut?: Date;

  @Column({ type: 'text', nullable: true })
  method?: string; // face | gps | qr | biometric

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'text', default: 'On Time' })
  status!: string; // On Time | Late

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
