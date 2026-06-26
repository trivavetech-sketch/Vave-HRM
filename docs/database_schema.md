# Database Schema (PostgreSQL)

## Overview
The platform uses **one Cloud SQL PostgreSQL instance** with **separate schemas per tenant**. Each tenant gets its own schema (`tenant_<tenant_id>`) containing the full set of tables. This provides logical isolation while sharing the same DB resources for cost efficiency.

## Shared (Global) Tables
These tables exist in the `public` schema and store information that is not tenant‑specific.
```sql
CREATE TABLE public.tenants (
    tenant_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 TEXT NOT NULL,
    domain               TEXT UNIQUE,
    branding_json        JSONB,
    plan                 TEXT NOT NULL,
    employee_limit       INTEGER,
    storage_limit_gb     INTEGER,
    created_at           TIMESTAMPTZ DEFAULT now(),
    updated_at           TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.subscription_events (
    event_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id  UUID REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g., 'payment_success', 'plan_change'
    payload    JSONB,
    occurred_at TIMESTAMPTZ DEFAULT now()
);
```

## Tenant Schema Template
All tenant schemas follow the same structure. When a new tenant is provisioned, the system creates a schema named `tenant_<tenant_id>` and runs the template DDL.

### 1. Organization & Structure
```sql
CREATE TABLE organization (
    org_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    address         TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE branch (
    branch_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES organization(org_id),
    name            TEXT NOT NULL,
    location        TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE department (
    dept_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id       UUID REFERENCES branch(branch_id),
    name            TEXT NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE designation (
    desig_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    level           INTEGER,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 2. Users & Employees
```sql
CREATE TABLE "user" (
    user_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL, -- super_admin, tenant_admin, hr_manager, etc.
    tenant_id_ref   UUID NOT NULL, -- mirrors the schema name for safety
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE employee (
    employee_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES "user"(user_id),
    org_id          UUID REFERENCES organization(org_id),
    branch_id       UUID REFERENCES branch(branch_id),
    dept_id         UUID REFERENCES department(dept_id),
    desig_id        UUID REFERENCES designation(desig_id),
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    date_of_birth   DATE,
    hire_date       DATE NOT NULL,
    status          TEXT NOT NULL, -- active, probation, terminated
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 3. Attendance & Leave
```sql
CREATE TABLE attendance (
    attendance_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID REFERENCES employee(employee_id),
    check_in        TIMESTAMPTZ,
    check_out       TIMESTAMPTZ,
    method          TEXT, -- face, gps, qr, biometric
    location        TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leave_policy (
    policy_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    accrual_rate    NUMERIC,
    max_days        INTEGER,
    carry_forward   BOOLEAN,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leave_request (
    request_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID REFERENCES employee(employee_id),
    policy_id       UUID REFERENCES leave_policy(policy_id),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    status          TEXT NOT NULL, -- pending, approved, rejected
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 4. Payroll
```sql
CREATE TABLE salary_structure (
    structure_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    base_salary     NUMERIC NOT NULL,
    allowances_json JSONB,
    deductions_json JSONB,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payroll_run (
    run_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    status          TEXT NOT NULL, -- pending, processing, completed, locked
    generated_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payroll_entry (
    entry_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id          UUID REFERENCES payroll_run(run_id),
    employee_id     UUID REFERENCES employee(employee_id),
    gross_amount    NUMERIC,
    tax_amount      NUMERIC,
    net_amount      NUMERIC,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 5. Recruitment
```sql
CREATE TABLE job_requisition (
    req_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    department_id   UUID REFERENCES department(dept_id),
    status          TEXT NOT NULL, -- open, closed, cancelled
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE candidate (
    candidate_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    email           TEXT,
    resume_url      TEXT,
    status          TEXT NOT NULL, -- applied, interview, offer, hired, rejected
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 6. Auditing
```sql
CREATE TABLE audit_log (
    audit_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES "user"(user_id),
    action          TEXT NOT NULL,
    table_name      TEXT,
    record_id       UUID,
    before_json     JSONB,
    after_json      JSONB,
    ip_address      INET,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

## Indexes & Performance
- **Tenant‑wide indexes** on `employee_id`, `user_id`, `created_at` for each table.
- **GIN indexes** on JSONB columns (`branding_json`, `allowances_json`, `deductions_json`).
- **Partial indexes** for active records (e.g., `WHERE status = 'active'`).
- **Foreign‑key constraints** ensure referential integrity across schema boundaries.

## Migration Strategy
1. **Create schema** `tenant_<tenant_id>` on tenant onboarding.
2. **Run template DDL** (above) inside that schema.
3. **Grant usage** on the schema to the tenant’s DB role.
4. **Future schema changes** use versioned migration scripts stored under `infra/migrations/`.

---
*The schema will evolve as modules are added. All DDL is written for PostgreSQL 15.*
