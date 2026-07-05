import axios from "axios";
import { toEmployeeList, toCreateEmployeePayload, toAttendanceList, toAttendanceLog, toCandidateList, toCreateCandidatePayload, toPayrollList } from "./transformers";
import type { Employee, AttendanceLog, Candidate, PayrollRun } from "@/lib/types";
import { mockEmployees, generateMockAttendance, mockCandidates, generateMockPayroll, generateRandomCandidate, mockLeaveRequests, mockLeaveBalances, mockNotifications, chartBars } from "@/lib/mockData";
import type { LeaveRequest, LeaveBalance, Notification, ChartBar } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vave_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─────────────────────────────────────────────
// Employees
// ─────────────────────────────────────────────
let _cachedEmployees: Employee[] | null = null;

export async function fetchEmployees(): Promise<Employee[]> {
  if (_cachedEmployees) return _cachedEmployees;
  try {
    const { data } = await api.get("/employees");
    const items = data.items || data || [];
    _cachedEmployees = toEmployeeList(Array.isArray(items) ? items : []);
    return _cachedEmployees;
  } catch {
    // Fall back to mock
    return Promise.resolve(mockEmployees);
  }
}

export async function createEmployee(form: { name: string; email: string; dept: string; role: string; status: string }): Promise<Employee> {
  const payload = toCreateEmployeePayload(form);
  try {
    const { data } = await api.post("/employees", payload);
    const emp = Array.isArray(data) ? data[0] : data;
    return toEmployeeList([emp])[0];
  } catch {
    // Fall back: create locally
    const names = form.name.split(" ");
    const created: Employee = {
      employeeId: `emp-${Date.now()}`,
      firstName: names[0] || "",
      lastName: names.slice(1).join(" ") || "User",
      email: form.email,
      dept: form.dept,
      role: form.role,
      status: (form.status === "Active" || form.status === "Probation" ? form.status : "Active") as "Active" | "Probation",
      hireDate: new Date().toISOString().split("T")[0],
      phone: "+91 9XXXXXXXX",
    };
    if (_cachedEmployees) _cachedEmployees = [created, ..._cachedEmployees];
    return created;
  }
}

export function invalidateEmployeesCache() {
  _cachedEmployees = null;
}

// ─────────────────────────────────────────────
// Attendance
// ─────────────────────────────────────────────
export async function fetchAttendance(): Promise<AttendanceLog[]> {
  try {
    const { data } = await api.get("/attendance");
    const items = data.items || data || [];
    return toAttendanceList(Array.isArray(items) ? items : []);
  } catch {
    return Promise.resolve(generateMockAttendance());
  }
}

export async function clockIn(employeeId: string, method?: string, location?: string): Promise<AttendanceLog> {
  const payload = {
    employeeId,
    method: method || "Web QR",
    location: location || "HQ (Office 1)",
  };
  try {
    const { data } = await api.post("/attendance/check-in", payload);
    return toAttendanceLog(data);
  } catch {
    // Fall back: create locally
    const now = new Date();
    const isLate = now.getHours() >= 9 && now.getMinutes() > 15;
    return {
      attendanceId: `att-${Date.now()}`,
      employeeId,
      employee: { firstName: "Unknown", lastName: "Employee" },
      checkIn: now.toISOString(),
      method: payload.method,
      location: payload.location,
      status: isLate ? "Late" : "On Time",
    };
  }
}

// ─────────────────────────────────────────────
// Payroll
// ─────────────────────────────────────────────
export async function fetchPayrollRuns(): Promise<PayrollRun[]> {
  try {
    const { data } = await api.get("/payroll/runs");
    const items = data.items || data || [];
    return toPayrollList(Array.isArray(items) ? items : []);
  } catch {
    return Promise.resolve(generateMockPayroll(8));
  }
}

// ─────────────────────────────────────────────
// Candidates
// ─────────────────────────────────────────────
export async function fetchCandidates(): Promise<Candidate[]> {
  try {
    const { data } = await api.get("/candidates");
    const items = data.items || data || [];
    return toCandidateList(Array.isArray(items) ? items : []);
  } catch {
    return Promise.resolve(mockCandidates);
  }
}

export async function createCandidate(name: string, email?: string, role?: string): Promise<Candidate> {
  const payload = toCreateCandidatePayload({ name, email, role });
  try {
    const { data } = await api.post("/candidates", payload);
    const cand = Array.isArray(data) ? data[0] : data;
    return toCandidateList([cand])[0];
  } catch {
    const cand = generateRandomCandidate();
    cand.name = name;
    cand.email = email || cand.email;
    cand.role = role || cand.role;
    return cand;
  }
}

// ─────────────────────────────────────────────
// Leave (mock only — no backend yet)
// ─────────────────────────────────────────────
export function fetchLeaveRequests(): LeaveRequest[] {
  return mockLeaveRequests;
}

export function fetchLeaveBalances(): LeaveBalance[] {
  return mockLeaveBalances;
}

// ─────────────────────────────────────────────
// Notifications (mock only — no backend yet)
// ─────────────────────────────────────────────
export function fetchNotifications(): Notification[] {
  return mockNotifications;
}

// ─────────────────────────────────────────────
// Charts (static mock)
// ─────────────────────────────────────────────
export function fetchChartBars(): ChartBar[] {
  return chartBars;
}
