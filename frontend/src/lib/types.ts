// ── Employee ──
export interface Employee {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  dept: string;
  role: string;
  status: "Active" | "Probation" | "Terminated";
  hireDate: string;
  phone: string;
}

// ── Attendance ──
export interface AttendanceLog {
  attendanceId: string;
  employeeId: string;
  employee: { firstName: string; lastName: string };
  checkIn: string;
  checkOut?: string;
  method: string;
  location: string;
  status: "On Time" | "Late";
}

// ── Candidate ──
export interface Candidate {
  name: string;
  email: string;
  role: string;
  status: string;
}

// ── Payroll Run ──
export interface PayrollRun {
  runId: string;
  period: string;
  employees: number;
  amount: string;
  status: "Processing" | "Completed";
}

// ── Payroll Summary Card ──
export interface PayrollSummaryCard {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ── Dashboard Stat ──
export interface StatCard {
  title: string;
  val: string | number;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// ── Chart Bar ──
export interface ChartBar {
  day: string;
  onTime: number;
  late: number;
}

// ── Kanban Stage ──
export interface KanbanStage {
  name: string;
  cands: Candidate[];
}

// ── Toast ──
export interface ToastAction {
  type: "success" | "error";
  message: string;
}

// ── New Employee Form ──
export interface NewEmployeeForm {
  name: string;
  email: string;
  dept: string;
  role: string;
  status: string;
}

// ── Leave Request ──
export interface LeaveRequest {
  leaveId: string;
  employeeId: string;
  employee: { firstName: string; lastName: string };
  type: "Sick" | "Casual" | "Annual" | "Maternity" | "Paternity";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
}

// ── Leave Balance ──
export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

// ── Notification ──
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

// ── Settings ──
export interface CompanyProfile {
  companyName: string;
  logo: string; // emoji or URL
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  currency: string;
  fiscalYearStart: string;
}

export interface NotificationPreferences {
  emailNewEmployee: boolean;
  emailLeaveRequest: boolean;
  emailPayrollComplete: boolean;
  emailCandidateApplied: boolean;
  emailClockInReminder: boolean;
  pushNewEmployee: boolean;
  pushLeaveRequest: boolean;
  pushPayrollComplete: boolean;
  pushCandidateApplied: boolean;
  pushClockInReminder: boolean;
  smsClockInReminder: boolean;
  smsLeaveApproved: boolean;
}

export interface RolePermission {
  roleId: string;
  name: string;
  description: string;
  color: string;
  permissions: {
    manageEmployees: boolean;
    manageAttendance: boolean;
    managePayroll: boolean;
    manageRecruitment: boolean;
    manageLeave: boolean;
    manageSettings: boolean;
    viewReports: boolean;
    manageUsers: boolean;
  };
  employeeCount: number;
}

// ── Status Color Maps ──
export const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-600 border-emerald-200",
  Probation: "bg-amber-100 text-amber-600 border-amber-200",
  Terminated: "bg-rose-100 text-rose-600 border-rose-200",
};

export const statusDots: Record<string, string> = {
  Active: "bg-emerald-500",
  Probation: "bg-amber-500",
  Terminated: "bg-rose-500",
};
