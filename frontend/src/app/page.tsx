"use client";

import { useState } from "react";
import {
  Users,
  Clock,
  DollarSign,
  Briefcase,
  Search,
  Filter,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Menu,
  ChevronRight,
  TrendingUp,
  Settings,
  Bell,
  LogOut,
  Calendar,
  Layers
} from "lucide-react";

// Mock Data matching database schema entities
const initialEmployees = [
  { id: "1", name: "Suresh Kumar", email: "suresh.k@vave.com", dept: "Engineering", role: "Frontend Lead", status: "Active", joinDate: "2024-01-15" },
  { id: "2", name: "Neha Sharma", email: "neha.s@vave.com", dept: "HR", role: "HR Manager", status: "Active", joinDate: "2024-02-10" },
  { id: "3", name: "Amit Patel", email: "amit.p@vave.com", dept: "Product", role: "Product Manager", status: "Active", joinDate: "2023-11-01" },
  { id: "4", name: "Priya Nair", email: "priya.n@vave.com", dept: "Engineering", role: "Backend Engineer", status: "Active", joinDate: "2024-03-01" },
  { id: "5", name: "Vikram Singh", email: "vikram.s@vave.com", dept: "Sales", role: "Sales Executive", status: "Probation", joinDate: "2026-05-15" },
  { id: "6", name: "Rohan Das", email: "rohan.d@vave.com", dept: "Marketing", role: "Growth Specialist", status: "Terminated", joinDate: "2023-05-10" }
];

const mockAttendance = [
  { id: "1", name: "Suresh Kumar", checkIn: "09:05 AM", method: "GPS Face ID", location: "HQ (Office 1)", status: "On Time" },
  { id: "2", name: "Neha Sharma", checkIn: "09:12 AM", method: "GPS Face ID", location: "HQ (Office 1)", status: "On Time" },
  { id: "3", name: "Amit Patel", checkIn: "09:35 AM", method: "Biometric", location: "HQ (Office 2)", status: "Late" },
  { id: "4", name: "Priya Nair", checkIn: "08:55 AM", method: "Web QR", location: "Remote", status: "On Time" }
];

const mockPayrollRuns = [
  { runId: "PR-2026-06", period: "June 2026", employees: 42, amount: "₹1,85,000", status: "Processing" },
  { runId: "PR-2026-05", period: "May 2026", employees: 40, amount: "₹1,75,000", status: "Completed" },
  { runId: "PR-2026-04", period: "April 2026", employees: 40, amount: "₹1,75,000", status: "Completed" }
];

const mockCandidates = [
  { name: "Anil K.", email: "anil.k@gmail.com", role: "DevOps Engineer", status: "Technical Interview" },
  { name: "Sneha G.", email: "sneha.g@yahoo.com", role: "Product Designer", status: "Offer Extended" },
  { name: "Ketan M.", email: "ketan.m@outlook.com", role: "QA Engineer", status: "Applied" }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [employees, setEmployees] = useState(initialEmployees);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New Employee Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", email: "", dept: "", role: "", status: "Active" });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: String(employees.length + 1),
      ...newEmp,
      joinDate: new Date().toISOString().split("T")[0]
    };
    setEmployees([created, ...employees]);
    setNewEmp({ name: "", email: "", dept: "", role: "", status: "Active" });
    setShowAddModal(false);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`fixed md:relative z-50 w-64 h-screen border-r border-orange-200 bg-white/95 backdrop-blur-md flex flex-col justify-between transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-orange-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/20">
              V
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Vave HRM
              </h1>
              <span className="text-[10px] text-slate-9000 uppercase tracking-widest font-semibold">Enterprise SaaS</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {[
              { name: "Dashboard", icon: Layers },
              { name: "Employees", icon: Users },
              { name: "Attendance", icon: Clock },
              { name: "Payroll", icon: DollarSign },
              { name: "Recruitment", icon: Briefcase }
            ].map(item => (
              <button
                key={item.name}
                onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                  activeTab === item.name
                    ? "bg-orange-100 text-orange-600 font-medium border-l-2 border-orange-500"
                    : "text-slate-600 hover:bg-orange-50 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </nav>
        </div>

        {/* User profile bottom */}
        <div className="p-4 border-t border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white">
              NS
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Neha Sharma</p>
              <p className="text-[10px] text-slate-9000">Tenant Administrator</p>
            </div>
          </div>
          <button className="text-slate-9000 hover:text-red-500 p-1.5 rounded-lg hover:bg-orange-50 transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 border-b border-orange-200 bg-white/90 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-orange-50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 hidden sm:block">{activeTab} Overview</h2>
            <div className="h-4 w-px bg-orange-100"></div>
            <span className="text-xs text-slate-9000 bg-orange-100 px-2 py-0.5 rounded-md font-mono">tenant_09ef182b</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-600 hover:text-slate-800 relative transition">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-600 hover:text-slate-800 transition">
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Body content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 flex-1">
          
          {/* ── TAB 1: DASHBOARD VIEW ── */}
          {activeTab === "Dashboard" && (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Roster", val: employees.length, change: "+2 this month", icon: Users, color: "text-orange-600 bg-orange-100" },
                  { title: "Clocked In Today", val: "4 / 5", change: "80% active attendance", icon: Clock, color: "text-emerald-600 bg-emerald-100" },
                  { title: "Payroll (June)", val: "₹1,85,000", change: "Processing stage", icon: DollarSign, color: "text-amber-600 bg-amber-100" },
                  { title: "Active Candidates", val: mockCandidates.length, change: "2 interviews today", icon: Briefcase, color: "text-purple-600 bg-purple-100" }
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-orange-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-9000 font-medium uppercase tracking-wider">{stat.title}</span>
                      <h3 className="text-2xl font-bold mt-1 text-slate-900">{stat.val}</h3>
                      <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-orange-600" />
                        {stat.change}
                      </span>
                    </div>
                    <div className={`p-3.5 rounded-xl ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Layout for Charts & Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart Panel */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-orange-200 flex flex-col justify-between h-[360px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Attendance & Activity Trends</h4>
                      <p className="text-xs text-slate-9000">Weekly representation of workforce activity logs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <span className="text-[10px] text-slate-600">On Time</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2"></span>
                      <span className="text-[10px] text-slate-600">Late</span>
                    </div>
                  </div>

                  {/* Simple CSS Chart bars */}
                  <div className="flex items-end justify-between h-48 px-4 border-b border-orange-200">
                    {[
                      { day: "Mon", onTime: 85, late: 15 },
                      { day: "Tue", onTime: 92, late: 8 },
                      { day: "Wed", onTime: 78, late: 22 },
                      { day: "Thu", onTime: 90, late: 10 },
                      { day: "Fri", onTime: 88, late: 12 }
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 w-16">
                        <div className="flex flex-col-reverse justify-end w-4 h-36 bg-orange-100 rounded-full overflow-hidden">
                          <div style={{ height: `${bar.late}%` }} className="bg-amber-500 w-full transition-all"></div>
                          <div style={{ height: `${bar.onTime}%` }} className="bg-orange-500 w-full transition-all"></div>
                        </div>
                        <span className="text-[10px] text-slate-9000 font-semibold">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidate Feed Panel */}
                <div className="p-6 rounded-2xl bg-white border border-orange-200 flex flex-col h-[360px]">
                  <h4 className="text-sm font-semibold text-slate-800 mb-4">ATS Recruitment Feed</h4>
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    {mockCandidates.map((cand, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-orange-100/30 border border-orange-200/80 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{cand.name}</p>
                          <p className="text-[10px] text-slate-9000">{cand.role}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-600 border border-orange-500/20">
                          {cand.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── TAB 2: EMPLOYEES VIEW ── */}
          {activeTab === "Employees" && (
            <div className="space-y-6">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="w-4 h-4 text-slate-9000 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-xl bg-white border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800 transition"
                    />
                  </div>

                  <div className="flex items-center bg-white border border-orange-200 rounded-xl p-1 text-xs">
                    {["All", "Active", "Probation"].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          statusFilter === status ? "bg-orange-100 text-slate-800 font-semibold" : "text-slate-9000 hover:text-slate-700"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-semibold text-white transition shadow-md shadow-orange-500/20 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Add Employee
                </button>
              </div>

              {/* Employees Table */}
              <div className="rounded-2xl border border-orange-200 bg-white/20 overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-orange-200 bg-white text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <th className="p-4">Name & Email</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Job Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Join Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-100 text-sm">
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id} className="hover:bg-white transition">
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-slate-800">{emp.name}</p>
                            <p className="text-xs text-slate-9000">{emp.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-700">{emp.dept}</td>
                        <td className="p-4 text-slate-600">{emp.role}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            emp.status === "Active"
                              ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                              : emp.status === "Probation"
                              ? "bg-amber-100 text-amber-600 border-amber-200"
                              : "bg-rose-100 text-rose-600 border-rose-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              emp.status === "Active" ? "bg-emerald-500" : emp.status === "Probation" ? "bg-amber-500" : "bg-rose-500"
                            }`}></span>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-9000">{emp.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 3: ATTENDANCE VIEW ── */}
          {activeTab === "Attendance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-orange-200 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Daily Clock-In Log</h3>
                  <p className="text-xs text-slate-9000">Live feed of employee attendance events</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-4 py-2 text-xs">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Today: {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Map Check-In Log */}
                <div className="rounded-2xl border border-orange-200 bg-white p-6 space-y-4">
                  <h4 className="text-sm font-semibold text-slate-800">Activity Log</h4>
                  <div className="divide-y divide-orange-100">
                    {mockAttendance.map(log => (
                      <div key={log.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                            {log.name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{log.name}</p>
                            <p className="text-[10px] text-slate-9000">{log.location} • {log.method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-800">{log.checkIn}</span>
                          <p className={`text-[10px] ${log.status === "On Time" ? "text-emerald-600" : "text-amber-600"}`}>{log.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Map Geofence Radar */}
                <div className="rounded-2xl border border-orange-200 bg-white p-6 flex flex-col justify-between h-[300px]">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Active Geofencing Zones</h4>
                    <p className="text-xs text-slate-9000">Real-time status of configured workplace coordinate hubs</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="w-32 h-32 rounded-full border border-orange-500/20 flex items-center justify-center animate-pulse">
                      <div className="w-24 h-24 rounded-full border border-orange-500/40 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-orange-100 border border-orange-500 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>HQ Main: 100m Radius</span>
                    <span className="text-emerald-600 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: PAYROLL VIEW ── */}
          {activeTab === "Payroll" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Payroll Executions</h3>
                  <p className="text-xs text-slate-9000">Manage monthly salary processing runs</p>
                </div>
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-semibold text-white transition">
                  <Plus className="w-4 h-4" />
                  Initiate Payroll Run
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {mockPayrollRuns.map(run => (
                  <div key={run.runId} className="p-6 rounded-2xl bg-white border border-orange-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-9000 font-mono tracking-wider">{run.runId}</span>
                      <h4 className="text-base font-bold text-slate-800 mt-0.5">{run.period}</h4>
                      <p className="text-xs text-slate-600 mt-1">Calculated for {run.employees} registered employees</p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div>
                        <span className="text-xs text-slate-9000">Gross Payout</span>
                        <p className="text-base font-bold text-slate-800 mt-0.5">{run.amount}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          run.status === "Completed"
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                            : "bg-orange-100 text-orange-600 border border-orange-500/20 animate-pulse"
                        }`}>
                          {run.status === "Completed" ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {run.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 5: RECRUITMENT VIEW ── */}
          {activeTab === "Recruitment" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-slate-800">ATS Candidates Pipeline</h3>
                <p className="text-xs text-slate-9000">Review applicants undergoing interview loops</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Applied", count: 1, cands: [mockCandidates[2]] },
                  { name: "Interview Loop", count: 1, cands: [mockCandidates[0]] },
                  { name: "Offer Made", count: 1, cands: [mockCandidates[1]] }
                ].map((col, idx) => (
                  <div key={idx} className="rounded-2xl border border-orange-200 bg-white p-4 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-4 border-b border-orange-200 pb-2">
                      <span className="text-xs font-bold text-slate-700">{col.name}</span>
                      <span className="text-[10px] bg-orange-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{col.count}</span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                      {col.cands.map((cand, cIdx) => (
                        <div key={cIdx} className="p-4 rounded-xl bg-orange-100/40 border border-orange-200 hover:border-orange-200 transition cursor-pointer">
                          <h5 className="text-xs font-semibold text-slate-800">{cand.name}</h5>
                          <p className="text-[10px] text-slate-9000 mt-1">{cand.role}</p>
                          <div className="mt-3 flex items-center justify-between text-[9px] text-slate-600">
                            <span>{cand.email}</span>
                            <span className="text-orange-600 font-semibold">View Detail</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── ADD EMPLOYEE MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-orange-200 rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-9000 hover:text-slate-700 hover:bg-orange-100"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-6">Create New Employee</h3>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.v@vave.com"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Department</label>
                  <select
                    value={newEmp.dept}
                    onChange={(e) => setNewEmp({ ...newEmp, dept: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800"
                  >
                    <option value="">Select Dept</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Product">Product</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QA Automation"
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Employment Status</label>
                <select
                  value={newEmp.status}
                  onChange={(e) => setNewEmp({ ...newEmp, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Probation">Probation</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold text-sm text-white transition shadow-md shadow-orange-500/20"
              >
                Save Employee
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
