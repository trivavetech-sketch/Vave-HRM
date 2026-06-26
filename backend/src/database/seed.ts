import { DataSource } from 'typeorm';
import { Tenant } from '../modules/tenant/entities/tenant.entity';

/**
 * Run database migrations and seed baseline data for the shared schemas.
 */
export async function seedGlobalDatabase(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  console.log('🌱 Starting global database seeding...');

  try {
    // 1. Seed default tenants
    const tenantRepo = dataSource.getRepository(Tenant);
    
    let demoTenant = await tenantRepo.findOne({ where: { domain: 'demo.vave-hrm.com' } });
    if (!demoTenant) {
      demoTenant = tenantRepo.create({
        name: 'Demo Org',
        domain: 'demo.vave-hrm.com',
        plan: 'professional',
        employeeLimit: 150,
        storageLimitGb: 20,
        brandingJson: { primaryColor: '#4f46e5', logoUrl: '' },
      });
      demoTenant = await tenantRepo.save(demoTenant);
      console.log(`✅ Demo Tenant created with ID: ${demoTenant.tenantId}`);
    } else {
      console.log('ℹ️ Demo tenant already exists.');
    }

    // 2. Initialize tenant-specific schema dynamically
    const schemaName = `tenant_${demoTenant.tenantId.replace(/-/g, '_')}`;
    console.log(`🏗️ Creating schema ${schemaName}...`);

    await queryRunner.createSchema(schemaName, true);

    // 3. Run the schema template DDL
    console.log(`🚀 Seeding tables inside schema ${schemaName}...`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "${schemaName}"."organization" (
        "org_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "address" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."branch" (
        "branch_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "org_id" UUID,
        "name" TEXT NOT NULL,
        "location" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."department" (
        "dept_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "branch_id" UUID,
        "name" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."designation" (
        "desig_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "level" INTEGER,
        "created_at" TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."user" (
        "user_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" TEXT UNIQUE NOT NULL,
        "password_hash" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "tenant_id_ref" UUID NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT now(),
        "updated_at" TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "${schemaName}"."employee" (
        "employee_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID,
        "org_id" UUID,
        "branch_id" UUID,
        "dept_id" UUID,
        "desig_id" UUID,
        "first_name" TEXT NOT NULL,
        "last_name" TEXT NOT NULL,
        "date_of_birth" DATE,
        "hire_date" DATE NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMPTZ DEFAULT now()
      );
    `);

    console.log(`🎉 Schema ${schemaName} tables initialized successfully!`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await queryRunner.release();
  }
}
