import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('candidate')
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  candidateId!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  resumeUrl?: string;

  @Column({ type: 'text', default: 'applied' })
  status!: string; // applied | interview | offer | hired | rejected

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
