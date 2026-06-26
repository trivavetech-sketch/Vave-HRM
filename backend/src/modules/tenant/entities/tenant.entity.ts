import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  tenantId!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', unique: true, nullable: true })
  domain?: string;

  @Column({ type: 'text' })
  plan!: string; // starter | professional | enterprise

  @Column({ type: 'int', nullable: true })
  employeeLimit?: number;

  @Column({ type: 'int', nullable: true })
  storageLimitGb?: number;

  @Column({ type: 'jsonb', nullable: true })
  brandingJson?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
