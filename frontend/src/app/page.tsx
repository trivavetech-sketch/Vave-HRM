"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEmployees, useAttendance, usePayroll, useCandidates, useLeave, useNotifications, useChartBars } from "@/hooks/useApiData";
import type { NewEmployeeForm, Employee } from "@/lib/types";
import * as apiService from "@/services/api";
import Sidebar from "@/components/Sidebar";
import ToastNotification from "@/components/ToastNotification";
import DashboardHome from "@/components/DashboardHome";
import EmployeeTable from "@/components/EmployeeTable";
import AttendanceLog from "@/components/AttendanceLog";
import PayrollCard from "@/components/PayrollCard";
import KanbanBoard from "@/components/KanbanBoard";
import LeaveManagement from "@/components/LeaveManagement";
import EmployeeDetailModal from "@/components/EmployeeDetailModal";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import AddEmployeeModal from "@/components/AddEmployeeModal";
import { Menu, Settings } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  // ── API Hooks (data with automatic fallback to mock) ──
  const { data: apiEmployees, loading: empLoading } = useEmployees();
  const { data: apiAttendance, loading: attLoading } = useAttendance();
  const { data: apiPayroll, loading: prLoading } = usePayroll();
  const { data: apiCandidates, addCandidate } = useCandidates();
  const chartBars = useChartBars();

  // ── State ──
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState(apiAttendance);
  const [candidates, setCandidates] = useState(apiCandidates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState<NewEmployeeForm>({ name: "", email: "", dept: "", role: "", status: "Active" });
  const [lastAction, setLastAction] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Leave & Notifications (mock-backed)
  const { requests: leaveRequests, balances: leaveBalances, approve: approveLeave, reject: rejectLeave } = useLeave();
  const { notifications, add: addNotification, markAllRead } = useNotifications();

  // ── Sync API data into local state (runs once on mount only — do NOT add deps)
  // Local state is used for mutations (add employee, clock-in, etc.) while hooks provide initial data.
  useEffect(() => { if (apiEmployees.length > 0) setEmployees(apiEmployees); }, [apiEmployees]);
  useEffect(() => { if (apiAttendance.length > 0) setAttendanceLogs(apiAttendance); }, [apiAttendance]);
  useEffect(() => { if (apiCandidates.length > 0) setCandidates(apiCandidates); }, [apiCandidates]);

  // ── Route protection ──
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return null;
  if (!isAuthenticated) return null;

  // ── Helpers ──
  const showAction = (type: "success" | "error", message: string) => {
    setLastAction({ type, message });
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await apiService.createEmployee(newEmp);
    setEmployees((prev) => [created, ...prev]);
    setNewEmp({ name: "", email: "", dept: "", role: "", status: "Active" });
    setShowAddModal(false);
    showAction("success", `${created.firstName} ${created.lastName} added successfully!`);
    addNotification("Employee Added", `${created.firstName} ${created.lastName} was onboarded today.`, "success");
  };

  const handleSimulateClockIn = async () => {
    const activeEmps = employees.filter((e) => e.status === "Active" || e.status === "Probation");
    if (activeEmps.length === 0) {
      showAction("error", "No active employees available to clock in.");
      return;
    }
    const randomEmp = activeEmps[Math.floor(Math.random() * activeEmps.length)];
    const methods = ["GPS Face ID", "Biometric", "Web QR"];
    const locations = ["HQ (Office 1)", "HQ (Office 2)", "Remote"];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];

    const log = await apiService.clockIn(randomEmp.employeeId, method, location);
    // Attach employee name from our local data
    const enrichedLog = { ...log, employee: { firstName: randomEmp.firstName, lastName: randomEmp.lastName } };
    setAttendanceLogs((prev) => [enrichedLog, ...prev]);
    showAction("success", `${randomEmp.firstName} clocked in (${enrichedLog.status})`);
    addNotification("Clock-in Recorded", `${randomEmp.firstName} ${randomEmp.lastName} clocked in from ${location} via ${method}.`, enrichedLog.status === "Late" ? "warning" : "success");
  };

  const handleSimulateCheckOut = () => {
    const checkedIn = attendanceLogs.filter((l) => !l.checkOut);
    if (checkedIn.length === 0) {
      showAction("error", "No employees currently checked in.");
      return;
    }
    const randomLog = checkedIn[Math.floor(Math.random() * checkedIn.length)];
    const now = new Date();
    const hoursWorked = Math.round((now.getTime() - new Date(randomLog.checkIn).getTime()) / (1000 * 60 * 60) * 10) / 10;
    setAttendanceLogs((prev) =>
      prev.map((l) =>
        l.attendanceId === randomLog.attendanceId ? { ...l, checkOut: now.toISOString() } : l
      )
    );
    showAction("success", `${randomLog.employee.firstName} checked out (${hoursWorked}h worked)`);
    addNotification("Check-out Recorded", `${randomLog.employee.firstName} ${randomLog.employee.lastName} checked out after ${hoursWorked}h.`, "info");
  };

  const handleSimulateCandidate = async () => {
    const names = ["Ravi S.", "Meera K.", "Arjun N.", "Divya P.", "Rahul V."];
    const roles = ["Frontend Dev", "Backend Dev", "Data Analyst", "HR Coordinator", "Marketing Lead"];
    const name = names[Math.floor(Math.random() * names.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const cand = await addCandidate(name, `${name.toLowerCase().replace(/\s/g, ".")}@example.com`, role);
    showAction("success", `Candidate "${cand.name}" added to pipeline`);
    addNotification("New Candidate", `${cand.name} applied for ${cand.role}.`, "info");
  };

  const handleApproveLeave = (leaveId: string) => {
    approveLeave(leaveId);
    const req = leaveRequests.find((r) => r.leaveId === leaveId);
    showAction("success", `Leave approved for ${req?.employee.firstName} ${req?.employee.lastName}`);
    addNotification("Leave Approved", `${req?.employee.firstName} ${req?.employee.lastName}'s ${req?.type?.toLowerCase()} leave was approved.`, "success");
  };

  const handleRejectLeave = (leaveId: string) => {
    rejectLeave(leaveId);
    const req = leaveRequests.find((r) => r.leaveId === leaveId);
    showAction("success", `Leave rejected for ${req?.employee.firstName} ${req?.employee.lastName}`);
    addNotification("Leave Rejected", `${req?.employee.firstName} ${req?.employee.lastName}'s ${req?.type?.toLowerCase()} leave request was rejected.`, "error");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // ── Filtered employees ──
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeEmployeeCount = employees.filter((e) => e.status !== "Terminated").length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <ToastNotification action={lastAction} />

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <Sidebar
        activeTab={activeTab}
        isMobileMenuOpen={isMobileMenuOpen}
        user={user}
        onTabChange={setActiveTab}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-orange-200 bg-white/90 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-orange-50">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 hidden sm:block">{activeTab} Overview</h2>
            <div className="h-4 w-px bg-orange-100" />
            <span className="text-xs text-slate-500 bg-orange-100 px-2 py-0.5 rounded-md font-mono">{user?.tenantId || "tenant_09ef182b"}</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsDropdown notifications={notifications} onMarkAllRead={markAllRead} />
            <button onClick={() => router.push("/settings")} className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-600 hover:text-slate-800 transition">
              <Settings className="w-[18px] h-[18px]" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8 flex-1">
          {activeTab === "Dashboard" && (
            <DashboardHome
              employeesCount={activeEmployeeCount}
              totalEmployees={employees.length}
              attendanceLogs={attendanceLogs}
              candidates={candidates}
              chartBars={chartBars}
              onSimulateClockIn={handleSimulateClockIn}
              onSimulateCandidate={handleSimulateCandidate}
            />
          )}

          {activeTab === "Employees" && (
            <>
              <EmployeeTable
                employees={filteredEmployees}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onSearchChange={setSearchQuery}
                onFilterChange={setStatusFilter}
                onAddClick={() => setShowAddModal(true)}
                onEmployeeClick={setSelectedEmployee}
              />
              <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
            </>
          )}

          {activeTab === "Attendance" && (
            <AttendanceLog
              logs={attendanceLogs}
              onSimulateClockIn={handleSimulateClockIn}
              onSimulateCheckOut={handleSimulateCheckOut}
            />
          )}

          {activeTab === "Leave" && (
            <LeaveManagement
              requests={leaveRequests}
              balances={leaveBalances}
              onApprove={handleApproveLeave}
              onReject={handleRejectLeave}
            />
          )}

          {activeTab === "Payroll" && <PayrollCard runs={apiPayroll} />}

          {activeTab === "Recruitment" && (
            <KanbanBoard candidates={candidates} onAddCandidate={handleSimulateCandidate} />
          )}
        </div>
      </main>

      <AddEmployeeModal form={newEmp} show={showAddModal} onClose={() => setShowAddModal(false)} onChange={setNewEmp} onSubmit={handleAddEmployee} />
    </div>
  );
}
