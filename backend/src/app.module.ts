import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    // ── Config ──────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    // ── Database ────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const dbUrl = cfg.get('DATABASE_URL');
        const useSsl = cfg.get('DB_SSL') === 'true' || !!dbUrl;
        
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            ssl: useSsl ? { rejectUnauthorized: false } : false,
            autoLoadEntities: true,
            synchronize: cfg.get('NODE_ENV') !== 'production',
            logging: cfg.get('NODE_ENV') !== 'production',
          };
        }

        return {
          type: 'postgres',
          host: cfg.get('DB_HOST'),
          port: cfg.get<number>('DB_PORT'),
          username: cfg.get('DB_USER'),
          password: cfg.get('DB_PASS'),
          database: cfg.get('DB_NAME'),
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: cfg.get('NODE_ENV') !== 'production',
          logging: cfg.get('NODE_ENV') !== 'production',
        };
      },
    }),

    // ── Bull (Redis queues) ─────────────────────────────
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const redisUrl = cfg.get('REDIS_URL');
        return {
          redis: redisUrl || {
            host: cfg.get('REDIS_HOST', 'localhost'),
            port: cfg.get<number>('REDIS_PORT', 6379),
          },
        };
      },
    }),

    // ── Feature modules ─────────────────────────────────
    AuthModule,
    TenantModule,
    EmployeeModule,
    AttendanceModule,
    PayrollModule,
    RecruitmentModule,
    AuditModule,
  ],
})
export class AppModule {}
