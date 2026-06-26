import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  auditId!: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'text' })
  action!: string;

  @Column({ type: 'text', nullable: true })
  tableName?: string;

  @Column({ type: 'uuid', nullable: true })
  recordId?: string;

  @Column({ type: 'jsonb', nullable: true })
  beforeJson?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  afterJson?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
