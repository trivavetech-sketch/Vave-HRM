# API Specification (OpenAPI 3.0)

## Overview
This OpenAPI document defines the RESTful endpoints for the core Vave HRM services. The spec is modular; each module (Employee, Attendance, Payroll, Recruitment, etc.) is grouped under its own tag.

## Base URL
```
https://api.<tenant-domain>/v1
```
All endpoints require a bearer JWT token in the `Authorization` header.

## Security
```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - BearerAuth: []
```

## Paths
### Employees
```yaml
/employees:
  get:
    tags:
      - Employee
    summary: List employees (paginated)
    parameters:
      - in: query
        name: page
        schema:
          type: integer
          default: 1
      - in: query
        name: limit
        schema:
          type: integer
          default: 20
    responses:
      '200':
        description: A page of employees
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmployeeListResponse'
  post:
    tags:
      - Employee
    summary: Create a new employee
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/EmployeeCreateRequest'
    responses:
      '201':
        description: Employee created
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'

/employees/{employeeId}:
  get:
    tags:
      - Employee
    summary: Get employee details
    parameters:
      - in: path
        name: employeeId
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '200':
        description: Employee object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'
  put:
    tags:
      - Employee
    summary: Update employee
    parameters:
      - in: path
        name: employeeId
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/EmployeeUpdateRequest'
    responses:
      '200':
        description: Updated employee
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'
  delete:
    tags:
      - Employee
    summary: Delete employee (soft delete)
    parameters:
      - in: path
        name: employeeId
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '204':
        description: Employee deleted
```

### Attendance
```yaml
/attendance:
  get:
    tags:
      - Attendance
    summary: List attendance records
    parameters:
      - in: query
        name: employeeId
        schema:
          type: string
          format: uuid
      - in: query
        name: from
        schema:
          type: string
          format: date-time
      - in: query
        name: to
        schema:
          type: string
          format: date-time
    responses:
      '200':
        description: Attendance list
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AttendanceListResponse'
  post:
    tags:
      - Attendance
    summary: Record a new attendance entry
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/AttendanceCreateRequest'
    responses:
      '201':
        description: Attendance recorded
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Attendance'
```

### Payroll
```yaml
/payroll/runs:
  get:
    tags:
      - Payroll
    summary: List payroll runs
    parameters:
      - in: query
        name: period
        schema:
          type: string
          example: '2024-01'
    responses:
      '200':
        description: Payroll runs list
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PayrollRunListResponse'
  post:
    tags:
      - Payroll
    summary: Initiate a new payroll run
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/PayrollRunCreateRequest'
    responses:
      '202':
        description: Payroll run accepted for processing
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PayrollRun'
```

### Recruitment
```yaml
/candidates:
  get:
    tags:
      - Recruitment
    summary: List candidates
    parameters:
      - in: query
        name: status
        schema:
          type: string
          enum: [applied, interview, offer, hired, rejected]
    responses:
      '200':
        description: Candidate list
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CandidateListResponse'
  post:
    tags:
      - Recruitment
    summary: Add a new candidate
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CandidateCreateRequest'
    responses:
      '201':
        description: Candidate created
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Candidate'
```

## Components
```yaml
components:
  schemas:
    Employee:
      type: object
      properties:
        employeeId:
          type: string
          format: uuid
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
        status:
          type: string
          enum: [active, probation, terminated]
        createdAt:
          type: string
          format: date-time
    EmployeeCreateRequest:
      type: object
      required: [firstName, lastName, email]
      properties:
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
        designationId:
          type: string
          format: uuid
        departmentId:
          type: string
          format: uuid
    EmployeeUpdateRequest:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
        status:
          type: string
          enum: [active, probation, terminated]
    EmployeeListResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Employee'
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
    Attendance:
      type: object
      properties:
        attendanceId:
          type: string
          format: uuid
        employeeId:
          type: string
          format: uuid
        checkIn:
          type: string
          format: date-time
        checkOut:
          type: string
          format: date-time
        method:
          type: string
        location:
          type: string
    AttendanceCreateRequest:
      type: object
      required: [employeeId, checkIn]
      properties:
        employeeId:
          type: string
          format: uuid
        checkIn:
          type: string
          format: date-time
        method:
          type: string
    AttendanceListResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Attendance'
        total:
          type: integer
    PayrollRun:
      type: object
      properties:
        runId:
          type: string
          format: uuid
        periodStart:
          type: string
          format: date
        periodEnd:
          type: string
          format: date
        status:
          type: string
          enum: [pending, processing, completed, locked]
        generatedAt:
          type: string
          format: date-time
    PayrollRunCreateRequest:
      type: object
      required: [periodStart, periodEnd]
      properties:
        periodStart:
          type: string
          format: date
        periodEnd:
          type: string
          format: date
    PayrollRunListResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/PayrollRun'
        total:
          type: integer
    Candidate:
      type: object
      properties:
        candidateId:
          type: string
          format: uuid
        name:
          type: string
        email:
          type: string
        status:
          type: string
          enum: [applied, interview, offer, hired, rejected]
        resumeUrl:
          type: string
    CandidateCreateRequest:
      type: object
      required: [name]
      properties:
        name:
          type: string
        email:
          type: string
        resumeUrl:
          type: string
    CandidateListResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Candidate'
        total:
          type: integer
```

---
*This spec is a starting point and will be expanded with additional modules (Leave, Performance, Asset Management, etc.) as development progresses.*
