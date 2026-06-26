# Development Roadmap

This document outlines the milestones and release timeline for Vave HRM from initial prototype to enterprise-ready SaaS.

```mermaid
gantt
    title Vave HRM Project Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: MVP
    Core Directory & Org Structure :active, 2026-06-01, 30d
    Attendance & Geo-Tracking     :active, 2026-06-15, 30d
    JWT Auth & Tenant Isolation   :active, 2026-07-01, 20d
    section Phase 2: Core HR
    Leave & PTO Rules             : 2026-07-15, 25d
    Payroll Processing Engine     : 2026-08-01, 35d
    Stripe & Razorpay Integration : 2026-08-15, 20d
    section Phase 3: Talent
    ATS & Recruitment Pipeline    : 2026-09-01, 40d
    OKRs & Appraisals             : 2026-09-20, 30d
    section Phase 4: Scale
    Multi-Region Cluster & HA      : 2026-10-15, 45d
    AI-driven Analytics           : 2026-11-01, 30d
```

## Milestone Details

### Milestone 1: Minimum Viable Product (MVP)
- **Goal:** Launch basic core HR features to secure initial beta users.
- **Key Deliverables:**
  - Multi-tenant PostgreSQL separation logic.
  - Basic Employee database with organization/branch tree schema.
  - Mobile-responsive Clock-in/Clock-out system with location tagging.
  - Administrative UI console.

### Milestone 2: Enterprise Core & Monetization
- **Goal:** Commercialize the product and add critical transactional processing.
- **Key Deliverables:**
  - Robust rule engine for Leave and Holiday policies.
  - Automated Payroll processing based on attendance metrics.
  - Subscription setup supporting tiered pricing.

### Milestone 3: ATS & Performance Tracking
- **Goal:** Expand system footprint to cover the entire employee lifecycle.
- **Key Deliverables:**
  - Applicant Tracking System with custom pipeline states.
  - Goal tracking (OKRs) and semi-annual performance reviews.

### Milestone 4: Scaling & Compliance
- **Goal:** Enterprise security alignment, custom integrations, and AI features.
- **Key Deliverables:**
  - SOC2 Compliance Auditing logs.
  - Custom API Integrations marketplace (Slack, Teams, QuickBooks).
