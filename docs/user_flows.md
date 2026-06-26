# Key User Journey Flows

This document details the main user flows through the Vave HRM platform.

## 1. Tenant Sign-Up & Onboarding

```mermaid
sequenceDiagram
    actor Client as Tenant Admin
    participant Gateway as API Gateway
    participant TS as Tenant Service
    participant DB as Cloud SQL
    
    Client->>Gateway: POST /tenants/signup
    Gateway->>TS: Create Tenant Request
    TS->>DB: INSERT INTO public.tenants
    TS->>DB: CREATE SCHEMA tenant_<id>
    TS->>DB: Run Template DDL inside tenant_<id>
    TS-->>Client: Return Signup Success (Redirect to Domain)
```

## 2. Employee Daily Attendance Check-In

```mermaid
sequenceDiagram
    actor Emp as Employee
    participant App as Frontend SPA
    participant Gateway as API Gateway
    participant AS as Attendance Service
    
    Emp->>App: Clicks "Check In" (Face scan or GPS location)
    App->>Gateway: POST /attendance
    Gateway->>AS: Record Entry (with location, method metadata)
    AS-->>Emp: Show Check-In Success (Green Checkmark)
```

## 3. Automated Payroll Processing Flow

```mermaid
sequenceDiagram
    actor Admin as HR Admin
    participant PS as Payroll Service
    participant Queue as Bull Queue
    participant DB as Cloud SQL
    
    Admin->>PS: POST /payroll/runs (Start Run)
    PS->>DB: INSERT INTO payroll_run (Status: pending)
    PS->>Queue: Add "calculate-payroll" job
    Queue-->>Admin: Return 202 (Accepted)
    
    Note over Queue: Background Worker Processes calculations
    Queue->>DB: Calculate & INSERT INTO payroll_entry
    Queue->>DB: UPDATE payroll_run (Status: completed)
    
    Note over Admin: Receives WebSocket event "payroll-finished"
```
