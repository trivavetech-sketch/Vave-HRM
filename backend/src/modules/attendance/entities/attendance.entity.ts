import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  attendanceId!: string;

  @Column({ type: 'uuid' })
  employeeId!: string;

  @Column({ type: 'timestamptz', nullable: true })
  checkIn?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  checkOut?: Date;

  @Column({ type: 'text', nullable: true })
  method?: string; // face | gps | qr | biometric

  @Column({ type: 'text', nullable: true })
  location?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
