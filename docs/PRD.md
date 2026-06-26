# Product Requirements Document (PRD)

## Vision
Vave HRM is an enterprise‑grade, multi‑tenant Human Resource Management System (HRMS) that empowers small‑to‑medium businesses and staffing agencies to manage employees, payroll, attendance, recruitment, performance, and compliance from a single, affordable SaaS platform.

## Target Audience
- SMEs (10‑500 employees)
- Staffing & recruitment agencies
- Enterprises looking for a modular, extensible HR core

## Core Modules
| Module | Description | Key Features |
|--------|-------------|--------------|
| **Tenant Management** | Multi‑tenant isolation (schema‑per‑tenant or shared with tenant_id). | Tenant onboarding, sub‑tenant hierarchy, data isolation, custom branding |
| **User & Role Management** | Centralized auth with RBAC and SSO (SAML/OIDC). | Admin, manager, employee roles, permission granularity |
| **Employee Directory** | Store personal, job, and compensation data. | Profile pages, bulk import/export, custom fields |
| **Attendance & Time‑Tracking** | Clock‑in/out, geofencing, PTO accrual. | Shift scheduling, leave requests, approvals |
| **Payroll** | Salary calculations, tax deductions, statutory compliance. | Payslip generation, direct‑deposit integration, payroll runs |
| **Recruitment** | Vacancy posting, candidate pipeline, interview scheduling. | ATS, resume parsing, email templates |
| **Performance & Goals** | OKR/KPI tracking, appraisal workflow. | Self‑assessment, manager review, rating scales |
| **Reports & Analytics** | Dashboard & exportable reports. | Custom report builder, data export CSV/Excel |
| **Integrations** | Third‑party payroll, accounting, messaging. | Stripe/Razorpay billing, QuickBooks, Slack, Teams |

## Non‑Functional Requirements
- **Scalability**: Support 100k+ concurrent users across tenants, auto‑scale on AWS.
- **Security**: OWASP Top‑10 compliance, data encryption at rest & in‑flight, GDPR/CCPA.
- **Availability**: 99.9% SLA, multi‑AZ deployment, health checks.
- **Performance**: API latency < 200 ms for read, < 500 ms for write under normal load.
- **Observability**: Centralized logging, metrics (Prometheus), tracing (OpenTelemetry).
- **Compliance**: ISO‑27001, SOC‑2 Type II readiness.

## Subscription & Billing
- Tiered plans (Starter, Professional, Enterprise).
- Monthly/annual billing via Stripe (global) and Razorpay (India).
- Usage‑based add‑ons (additional seats, premium support).

## Roadmap (MVP → Enterprise)
1. **MVP (0‑3 months)** – Core employee directory, attendance, role‑based access, tenant isolation, basic UI.
2. **Phase 2 (3‑6 months)** – Payroll engine, recruitment ATS, analytics dashboard, Stripe integration.
3. **Phase 3 (6‑9 months)** – Performance management, multi‑currency support, SSO, audit logs.
4. **Phase 4 (9‑12 months)** – Advanced AI‑driven insights, marketplace for integrations, global compliance.

## Success Metrics
- Customer acquisition: 200 SME customers within 12 months.
- Retention: > 90 % month‑over‑month churn < 5 %.
- Revenue: $1 M ARR by end of year 1.
- System health: < 1 % error rate, < 2 min mean‑time‑to‑recover.

---
*This document will be expanded with detailed user stories, acceptance criteria, and UI wireframes in subsequent phases.*
