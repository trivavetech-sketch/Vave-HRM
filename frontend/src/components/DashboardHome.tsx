"use client";

import { TrendingUp, RefreshCw, Users, Clock, DollarSign, Briefcase } from "lucide-react";
import type { StatCard, AttendanceLog, Candidate, ChartBar } from "@/lib/types";

interface DashboardHomeProps {
  employeesCount: number;
  totalEmployees: number;
  attendanceLogs: AttendanceLog[];
  candidates: Candidate[];
  chartBars: ChartBar[];
  onSimulateClockIn: () => void;
  onSimulateCandidate: () => void;
}

export default function DashboardHome({
  employeesCount,
  totalEmployees,
  attendanceLogs,
  candidates,
  chartBars,
  onSimulateClockIn,
  onSimulateCandidate,
}: DashboardHomeProps) {
  const stats: StatCard[] = [
    { title: "Total Roster", val: employeesCount, change: "+2 this month", icon: Users, color: "text-orange-600 bg-orange-100" },
    { title: "Clocked In Today", val: `${attendanceLogs.length} / ${totalEmployees}`, change: `${Math.round((attendanceLogs.length / Math.max(totalEmployees, 1)) * 100)}% active`, icon: Clock, color: "text-emerald-600 bg-emerald-100" },
    { title: "Payroll (June)", val: "₹1,85,000", change: "Processing stage", icon: DollarSign, color: "text-amber-600 bg-amber-100" },
    { title: "Active Candidates", val: candidates.length, change: "2 interviews today", icon: Briefcase, color: "text-purple-600 bg-purple-100" },
  ];

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white border border-orange-200 flex items-center justify-between hover:shadow-md hover:shadow-orange-500/5 transition-shadow">
            <div>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.title}</span>
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

      {/* Charts + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-orange-200 flex flex-col justify-between h-[360px]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Attendance & Activity Trends</h4>
              <p className="text-xs text-slate-500">Weekly representation of workforce activity logs</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-[10px] text-slate-600">On Time</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" />
              <span className="text-[10px] text-slate-600">Late</span>
            </div>
          </div>
          <div className="flex items-end justify-between h-48 px-4 border-b border-orange-200">
            {chartBars.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-16">
                <div className="flex flex-col-reverse justify-end w-4 h-36 bg-orange-100 rounded-full overflow-hidden">
                  <div style={{ height: `${bar.late}%` }} className="bg-amber-500 w-full transition-all" />
                  <div style={{ height: `${bar.onTime}%` }} className="bg-orange-500 w-full transition-all" />
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Feed */}
        <div className="p-6 rounded-2xl bg-white border border-orange-200 flex flex-col h-[360px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-800">ATS Recruitment Feed</h4>
            <button onClick={onSimulateCandidate} className="text-[10px] bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 font-semibold transition">
              + Simulate
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {candidates.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8">No candidates yet. Click &quot;Simulate&quot; to add one.</p>
            )}
            {candidates.map((cand, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-orange-50/50 border border-orange-200/80 flex items-center justify-between hover:bg-orange-50 transition">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{cand.name}</p>
                  <p className="text-[10px] text-slate-500">{cand.role}</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-600 border border-orange-500/20">
                  {cand.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Attendance Summary */}
      <div className="p-5 rounded-2xl bg-white border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-800">Today&apos;s Activity</h4>
          <button onClick={onSimulateClockIn} className="text-[10px] bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 font-semibold transition flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Simulate Check-in
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {attendanceLogs.slice(0, 4).map((log) => (
            <div key={log.attendanceId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs">
                {log.employee.firstName[0]}{log.employee.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{log.employee.firstName} {log.employee.lastName}</p>
                <p className="text-[10px] text-slate-500 truncate">
                  {new Date(log.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {log.status}
                </p>
              </div>
            </div>
          ))}
          {attendanceLogs.length === 0 && (
            <p className="text-xs text-slate-400 col-span-full text-center py-4">No activity yet today.</p>
          )}
        </div>
      </div>
    </>
  );
}
