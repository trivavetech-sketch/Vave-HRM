import type { Employee, AttendanceLog, Candidate, PayrollRun } from "@/lib/types";

// ── Backend Employee → Frontend Employee ──
interface BackendEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  dept?: string;
  role?: string;
  status: string; // "active" | "probation" | "terminated" | string
  hireDate: string | Date;
  phone?: string;
}

export function toEmployee(be: BackendEmployee): Employee {
  const statusMap: Record<string, Employee["status"]> = {
    active: "Active",
    probation: "Probation",
    terminated: "Terminated",
  };
  return {
    employeeId: be.employeeId,
    firstName: be.firstName,
    lastName: be.lastName,
    email: be.email,
    dept: be.dept || "Unassigned",
    role: be.role || "Team Member",
    status: statusMap[be.status?.toLowerCase()] || "Active",
    hireDate: typeof be.hireDate === "string" ? be.hireDate : be.hireDate?.toISOString?.()?.split("T")[0] || new Date().toISOString().split("T")[0],
    phone: be.phone || "+91 9XXXXXXXX",
  };
}

export function toEmployeeList(items: BackendEmployee[]): Employee[] {
  return items.map(toEmployee);
}

// ── Frontend Employee → Backend Create Payload ──
interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  dept?: string;
  role?: string;
  status?: string;
  hireDate?: string;
}

export function toCreateEmployeePayload(form: { name: string; email: string; dept: string; role: string; status: string }): CreateEmployeePayload {
  const names = form.name.split(" ");
  const statusMap: Record<string, string> = {
    Active: "active",
    Probation: "probation",
    Terminated: "terminated",
  };
  return {
    firstName: names[0] || "",
    lastName: names.slice(1).join(" ") || "User",
    email: form.email,
    dept: form.dept || undefined,
    role: form.role || undefined,
    status: statusMap[form.status] || "active",
    hireDate: new Date().toISOString().split("T")[0],
  };
}

// ── Backend Attendance → Frontend AttendanceLog ──
interface BackendAttendance {
  attendanceId: string;
  employeeId: string;
  employee?: { firstName: string; lastName: string };
  checkIn: string | Date;
  checkOut?: string | Date | null;
  method?: string;
  location?: string;
  status?: string;
}

export function toAttendanceLog(ba: BackendAttendance): AttendanceLog {
  return {
    attendanceId: ba.attendanceId,
    employeeId: ba.employeeId,
    employee: ba.employee || { firstName: "Unknown", lastName: "Employee" },
    checkIn: typeof ba.checkIn === "string" ? ba.checkIn : ba.checkIn?.toISOString() || new Date().toISOString(),
    checkOut: ba.checkOut
      ? (typeof ba.checkOut === "string" ? ba.checkOut : ba.checkOut?.toISOString())
      : undefined,
    method: ba.method || "Web QR",
    location: ba.location || "HQ (Office 1)",
    status: (ba.status === "On Time" || ba.status === "Late" ? ba.status : "On Time") as "On Time" | "Late",
  };
}

export function toAttendanceList(items: BackendAttendance[]): AttendanceLog[] {
  return items.map(toAttendanceLog);
}

// ── Backend Candidate → Frontend Candidate ──
interface BackendCandidate {
  candidateId: string;
  name: string;
  email?: string;
  role?: string;
  status: string; // "applied" | "interview" | "offer" | "hired" | "rejected"
}

const candidateStatusMap: Record<string, string> = {
  applied: "Applied",
  interview: "Technical Interview",
  offer: "Offer Extended",
  hired: "Hired",
  rejected: "Rejected",
};

export function toCandidate(bc: BackendCandidate): Candidate {
  return {
    name: bc.name,
    email: bc.email || "",
    role: bc.role || "Applicant",
    status: candidateStatusMap[bc.status?.toLowerCase()] || bc.status,
  };
}

export function toCandidateList(items: BackendCandidate[]): Candidate[] {
  return items.map(toCandidate);
}

// ── Frontend Candidate → Backend Create Payload ──
export function toCreateCandidatePayload(data: { name: string; email?: string; role?: string }): Record<string, string | undefined> {
  return {
    name: data.name,
    email: data.email,
    role: data.role,
    status: "applied",
  };
}

// ── Backend PayrollRun → Frontend PayrollRun ──
interface BackendPayrollRun {
  runId: string;
  periodStart: string | Date;
  periodEnd: string | Date;
  status: string; // "pending" | "processing" | "completed" | "locked"
  generatedAt?: string | Date;
  createdAt?: string | Date;
}

function formatPeriod(start: string | Date, end: string | Date): string {
  const s = new Date(start);
  const e = new Date(end);
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${months[s.getMonth()]} ${s.getFullYear()}`;
  }
  return `${months[s.getMonth()]} ${s.getFullYear()} — ${months[e.getMonth()]} ${e.getFullYear()}`;
}

const payrollStatusMap: Record<string, PayrollRun["status"]> = {
  pending: "Processing",
  processing: "Processing",
  completed: "Completed",
  locked: "Completed",
};

export function toPayrollRun(bp: BackendPayrollRun): PayrollRun {
  return {
    runId: bp.runId,
    period: formatPeriod(bp.periodStart, bp.periodEnd),
    employees: 0, // Backend doesn't track employee count per run yet
    amount: "—",  // Backend doesn't track amount yet
    status: payrollStatusMap[bp.status?.toLowerCase()] || "Processing",
  };
}

export function toPayrollList(items: BackendPayrollRun[]): PayrollRun[] {
  return items.map(toPayrollRun);
}
