# Vave HRM SaaS Platform

Welcome to the **Vave HRM** project. This repository contains the full source code, documentation, and infrastructure as code for the enterprise‑grade multi‑tenant HRMS platform.

## Repository Structure
```
/README.md                - Project overview
/docs/                    - All product documentation
  PRD.md                 - Product Requirements Document
  architecture.md        - System architecture diagram and description
  database_schema.md     - PostgreSQL schema
  api_spec.md            - OpenAPI specification
  ui_wireframes/         - UI mockups (generated images)
  user_flows.md          - Key user journey flows
  roadmap.md             - Development roadmap
  testing_strategy.md    - Testing approach
  security_checklist.md  - Security controls checklist
  launch_strategy.md     - Go‑to‑market plan
  growth_strategy.md     - SaaS growth and revenue model
/backend/                - NestJS backend monorepo
/frontend/               - Next.js frontend application
/infra/                  - Terraform / CDK scripts for AWS resources
/docker/                 - Dockerfiles and docker‑compose for local dev
/k8s/                    - Helm charts / Kustomize for Kubernetes deployment
/ci/                     - CI/CD pipelines (GitHub Actions)
```

The next steps are to flesh out each component, generate diagrams, and implement the services.
