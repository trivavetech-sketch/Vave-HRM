# Testing Strategy

Vave HRM implements a multi-layered testing pyramid to guarantee platform reliability, data security, and flawless execution of payroll services.

## The Testing Pyramid

```
       / \
      /   \      E2E (Cypress / Playwright) - 5%
     /     \
    /-------\
   /         \   Integration Tests (Supertest) - 25%
  /           \
 /-------------\
/               \ Unit Tests (Jest) - 70%
-----------------
```

## 1. Unit Testing
- **Scope:** Pure functions, DTO validation, service methods without DB coupling, custom calculations (e.g. payroll taxes).
- **Tooling:** `Jest` for both Backend (NestJS) and Frontend (Next.js).
- **Target:** 80%+ code coverage on all core business services.
- **Run command:** `npm run test` (configured in GitLab CI).

## 2. Integration Testing
- **Scope:** Controllers, TypeORM entities, tenant schema isolation security checks.
- **Tooling:** NestJS testing utilities combined with `Supertest`.
- **Database:** Runs against a dedicated Docker container running PostgreSQL.

## 3. End-to-End (E2E) Testing
- **Scope:** High-value workflows (Tenant sign-up, Check-in/out, Payroll generation).
- **Tooling:** `Playwright`.
- **Environment:** Staging / Sandbox environment.

## 4. Performance & Load Testing
- **Scope:** API Gateways, concurrent tenant access scaling limits.
- **Tooling:** `k6` scripts simulating 10,000+ virtual users clocking in simultaneously.
