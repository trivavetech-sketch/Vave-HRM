# System Architecture

## Overview
The Vave HRM platform is built as a **modular, cloud‑native, multi‑tenant SaaS** using a micro‑services architecture. The diagram below (generated separately) illustrates the major components, data flow, and deployment boundaries.

## Core Layers
| Layer | Components | Description |
|-------|------------|-------------|
| **Client** | Web UI (React/Next.js) | Responsive, dark‑mode UI with dynamic routing and role‑based view rendering. |
| **Edge** | CDN (AWS CloudFront) + DNS (Route 53) | Global caching, TLS termination, WAF security. |
| **API Gateway** | AWS API Gateway (or Kong) | Routes requests to backend services, handles auth, rate‑limiting, request‑validation. |
| **Auth Service** | Auth0 / Keycloak (OIDC/SAML) | Centralized identity, RBAC, SSO, MFA. |
| **Backend Services** | NestJS micro‑services (Tenant Service, User Service, HR Core, Payroll, Recruitment, Analytics) | Each service is stateless, containerised, and scales independently. |
| **Message Bus** | Amazon SNS/SQS or Apache Kafka | Asynchronous communication for events (e.g., payroll run, employee onboarding). |
| **Data Stores** | PostgreSQL (multi‑tenant schema), Redis (caching), Elasticsearch (search), S3 (file storage) | Transactional data stored with tenant isolation via `tenant_id`. |
| **Integrations** | Stripe, Razorpay, QuickBooks, Slack, Teams | External SaaS connectors via secure webhooks and OAuth. |
| **Observability** | Prometheus + Grafana, OpenTelemetry, CloudWatch Logs | Central metrics, tracing, alerting, and log aggregation. |
| **CI/CD** | GitHub Actions + Docker Hub + EKS (or ECS) | Automated build, test, container image push, blue‑green deployments. |

## Multi‑Tenant Isolation
- **Option A – Shared Schema**: All tenants share the same PostgreSQL database tables with a `tenant_id` column. Row‑level security (RLS) enforces isolation.
- **Option B – Separate Schemas**: Each tenant gets a dedicated PostgreSQL schema. Easier data export/import and stronger isolation.
- The platform supports both; the chosen strategy can be configured per‑tenant.

## Deployment Topology (AWS)
```
[Client] -> CloudFront -> API Gateway -> Auth Service
                                   |
                                   +--> Service: Tenant
                                   +--> Service: User
                                   +--> Service: HR Core
                                   +--> Service: Payroll
                                   +--> Service: Recruitment
                                   +--> Service: Analytics
                                   |
                                Message Bus (SNS/SQS)
                                   |
                               PostgreSQL (RDS) + Redis + Elasticsearch + S3
``` 

## Security Controls
- TLS 1.2+ everywhere.
- WAF rules for OWASP top‑10.
- IAM least‑privilege for AWS resources.
- Data encryption at rest (KMS) and in‑flight.
- Auditing via CloudTrail.

---
*This document will be expanded with a detailed architecture diagram and deployment scripts.*
