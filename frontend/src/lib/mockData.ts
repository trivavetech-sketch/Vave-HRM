import type { Employee, Candidate, AttendanceLog, PayrollRun, ChartBar, LeaveRequest, LeaveBalance, Notification } from "./types";

// ── Employees ──
export const mockEmployees: Employee[] = [
  { employeeId: "emp-001", firstName: "Suresh", lastName: "Kumar", email: "suresh.k@vave.com", dept: "Engineering", role: "Frontend Lead", status: "Active", hireDate: "2024-01-15", phone: "+91 98765 43210" },
  { employeeId: "emp-002", firstName: "Neha", lastName: "Sharma", email: "neha.s@vave.com", dept: "HR", role: "HR Manager", status: "Active", hireDate: "2024-02-10", phone: "+91 98765 43211" },
  { employeeId: "emp-003", firstName: "Amit", lastName: "Patel", email: "amit.p@vave.com", dept: "Product", role: "Product Manager", status: "Active", hireDate: "2023-11-01", phone: "+91 98765 43212" },
  { employeeId: "emp-004", firstName: "Priya", lastName: "Nair", email: "priya.n@vave.com", dept: "Engineering", role: "Backend Engineer", status: "Active", hireDate: "2024-03-01", phone: "+91 98765 43213" },
  { employeeId: "emp-005", firstName: "Vikram", lastName: "Singh", email: "vikram.s@vave.com", dept: "Sales", role: "Sales Executive", status: "Probation", hireDate: "2026-05-15", phone: "+91 98765 43214" },
  { employeeId: "emp-006", firstName: "Rohan", lastName: "Das", email: "rohan.d@vave.com", dept: "Marketing", role: "Growth Specialist", status: "Terminated", hireDate: "2023-05-10", phone: "+91 98765 43215" },
  { employeeId: "emp-007", firstName: "Ananya", lastName: "Gupta", email: "ananya.g@vave.com", dept: "Engineering", role: "DevOps Engineer", status: "Active", hireDate: "2024-06-01", phone: "+91 98765 43216" },
  { employeeId: "emp-008", firstName: "Karan", lastName: "Mehta", email: "karan.m@vave.com", dept: "Design", role: "UI/UX Designer", status: "Active", hireDate: "2024-04-20", phone: "+91 98765 43217" },
];

// ── Candidates ──
export const mockCandidates: Candidate[] = [
  { name: "Anil K.", email: "anil.k@gmail.com", role: "DevOps Engineer", status: "Technical Interview" },
  { name: "Sneha G.", email: "sneha.g@yahoo.com", role: "Product Designer", status: "Offer Extended" },
  { name: "Ketan M.", email: "ketan.m@outlook.com", role: "QA Engineer", status: "Applied" },
];

// ── Attendance Generator ──
export function generateMockAttendance(): AttendanceLog[] {
  const now = new Date();
  const today = now.toDateString();
  return [
    { attendanceId: "att-001", employeeId: "emp-001", employee: { firstName: "Suresh", lastName: "Kumar" }, checkIn: new Date(`${today} 09:05:00`).toISOString(), method: "GPS Face ID", location: "HQ (Office 1)", status: "On Time" },
    { attendanceId: "att-002", employeeId: "emp-002", employee: { firstName: "Neha", lastName: "Sharma" }, checkIn: new Date(`${today} 09:12:00`).toISOString(), method: "GPS Face ID", location: "HQ (Office 1)", status: "On Time" },
    { attendanceId: "att-003", employeeId: "emp-003", employee: { firstName: "Amit", lastName: "Patel" }, checkIn: new Date(`${today} 09:35:00`).toISOString(), method: "Biometric", location: "HQ (Office 2)", status: "Late" },
    { attendanceId: "att-004", employeeId: "emp-004", employee: { firstName: "Priya", lastName: "Nair" }, checkIn: new Date(`${today} 08:55:00`).toISOString(), method: "Web QR", location: "Remote", status: "On Time" },
    { attendanceId: "att-005", employeeId: "emp-007", employee: { firstName: "Ananya", lastName: "Gupta" }, checkIn: new Date(`${today} 09:02:00`).toISOString(), method: "GPS Face ID", location: "HQ (Office 1)", status: "On Time" },
  ];
}

// ── Payroll Generator ──
export function generateMockPayroll(activeEmployeeCount: number): PayrollRun[] {
  return [
    { runId: "PR-2026-06", period: "June 2026", employees: activeEmployeeCount, amount: "₹1,85,000", status: "Processing" },
    { runId: "PR-2026-05", period: "May 2026", employees: 40, amount: "₹1,75,000", status: "Completed" },
    { runId: "PR-2026-04", period: "April 2026", employees: 40, amount: "₹1,75,000", status: "Completed" },
  ];
}

// ── Chart Bars ──
export const chartBars: ChartBar[] = [
  { day: "Mon", onTime: 85, late: 15 },
  { day: "Tue", onTime: 92, late: 8 },
  { day: "Wed", onTime: 78, late: 22 },
  { day: "Thu", onTime: 90, late: 10 },
  { day: "Fri", onTime: 88, late: 12 },
];

// ── Leave Requests ──
export const mockLeaveRequests: LeaveRequest[] = [
  { leaveId: "lv-001", employeeId: "emp-001", employee: { firstName: "Suresh", lastName: "Kumar" }, type: "Annual", startDate: "2026-07-20", endDate: "2026-07-24", days: 5, reason: "Family vacation to Kerala", status: "Approved", appliedOn: "2026-06-15" },
  { leaveId: "lv-002", employeeId: "emp-004", employee: { firstName: "Priya", lastName: "Nair" }, type: "Sick", startDate: "2026-07-08", endDate: "2026-07-08", days: 1, reason: "Not feeling well", status: "Approved", appliedOn: "2026-07-07" },
  { leaveId: "lv-003", employeeId: "emp-002", employee: { firstName: "Neha", lastName: "Sharma" }, type: "Casual", startDate: "2026-07-14", endDate: "2026-07-15", days: 2, reason: "Personal work", status: "Pending", appliedOn: "2026-07-10" },
  { leaveId: "lv-004", employeeId: "emp-003", employee: { firstName: "Amit", lastName: "Patel" }, type: "Maternity", startDate: "2026-08-01", endDate: "2026-10-31", days: 92, reason: "Maternity leave", status: "Approved", appliedOn: "2026-06-20" },
  { leaveId: "lv-005", employeeId: "emp-005", employee: { firstName: "Vikram", lastName: "Singh" }, type: "Annual", startDate: "2026-07-28", endDate: "2026-07-29", days: 2, reason: "Personal day", status: "Rejected", appliedOn: "2026-07-05" },
  { leaveId: "lv-006", employeeId: "emp-007", employee: { firstName: "Ananya", lastName: "Gupta" }, type: "Sick", startDate: "2026-07-11", endDate: "2026-07-12", days: 2, reason: "Doctor appointment", status: "Pending", appliedOn: "2026-07-09" },
  { leaveId: "lv-007", employeeId: "emp-008", employee: { firstName: "Karan", lastName: "Mehta" }, type: "Annual", startDate: "2026-08-10", endDate: "2026-08-14", days: 5, reason: "Design conference in Mumbai", status: "Pending", appliedOn: "2026-07-08" },
];

// ── Leave Balances ──
export const mockLeaveBalances: LeaveBalance[] = [
  { type: "Annual", total: 18, used: 7, remaining: 11 },
  { type: "Sick", total: 12, used: 3, remaining: 9 },
  { type: "Casual", total: 10, used: 4, remaining: 6 },
  { type: "Maternity", total: 182, used: 0, remaining: 182 },
];

// ── Notifications ──
export const mockNotifications: Notification[] = [
  { id: "not-001", title: "Leave Approved", message: "Suresh Kumar's annual leave (Jul 20-24) has been approved.", time: "2 hours ago", read: false, type: "success" },
  { id: "not-002", title: "New Candidate", message: "Anil K. has been moved to Technical Interview stage.", time: "3 hours ago", read: false, type: "info" },
  { id: "not-003", title: "Payroll Processing", message: "June 2026 payroll run has started processing.", time: "5 hours ago", read: false, type: "warning" },
  { id: "not-004", title: "Clock-in Reminder", message: "3 employees haven't clocked in yet today.", time: "Yesterday", read: true, type: "info" },
  { id: "not-005", title: "Leave Rejected", message: "Vikram Singh's leave request for Jul 28-29 was rejected.", time: "Yesterday", read: true, type: "error" },
  { id: "not-006", title: "System Update", message: "Vave HRM v2.4.1 has been deployed successfully.", time: "2 days ago", read: true, type: "success" },
];

// ── Random candidate generator ──
export function generateRandomCandidate(): Candidate {
  const names = ["Ravi S.", "Meera K.", "Arjun N.", "Divya P.", "Rahul V."];
  const roles = ["Frontend Dev", "Backend Dev", "Data Analyst", "HR Coordinator", "Marketing Lead"];
  const statuses = ["Applied", "Technical Interview", "Offer Extended"];
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return {
    name: pick(names),
    email: `${pick(names).toLowerCase().replace(/\s/g, ".")}@example.com`,
    role: pick(roles),
    status: pick(statuses),
  };
}
