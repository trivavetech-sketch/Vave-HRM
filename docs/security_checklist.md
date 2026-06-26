# Security Checklist & Controls

This document details the security configurations, controls, and compliance tasks required to run Vave HRM as an enterprise SaaS.

## 1. Data Isolation (Multi-Tenancy)
- [x] Separate database schema per tenant (`tenant_<id>`).
- [ ] Database users restricted to their respective schemas.
- [ ] Automated validation to reject requests where `tenantId` does not match the active DB context.

## 2. Infrastructure Security (GCP)
- [ ] VPC Private Subnets for GKE nodes and Cloud SQL instances.
- [ ] Cloud NAT for outbound internet connectivity.
- [ ] Google Cloud Armor (WAF) to protect against DDoS and OWASP top-10.
- [ ] KMS key-rotation for disk encryption.

## 3. Application Security (NestJS & Next.js)
- [x] Strong passport-jwt strategy validation.
- [x] Strict CORS origin white-listing.
- [ ] Helmet.js headers integrated on Express engine.
- [x] Mandatory class-validator DTO sanitization to avoid SQL injections.
- [ ] Multi-Factor Authentication (MFA) enforcement on high-level administrative tasks.

## 4. Compliance Audits
- [x] Detailed Audit Log records of all mutating actions.
- [ ] Periodic Penetration testing.
- [ ] SOC 2 Type II audit readiness.
