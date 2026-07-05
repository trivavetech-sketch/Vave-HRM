"use client";

import { useState } from "react";
import { CalendarRange, CheckCircle, XCircle, Clock, Umbrella } from "lucide-react";
import type { LeaveRequest, LeaveBalance } from "@/lib/types";

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-600 border-amber-200",
  Approved: "bg-emerald-100 text-emerald-600 border-emerald-200",
  Rejected: "bg-rose-100 text-rose-600 border-rose-200",
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Annual: CalendarRange,
  Sick: XCircle,
  Casual: Umbrella,
  Maternity: CheckCircle,
  Paternity: Clock,
};

interface LeaveManagementProps {
  requests: LeaveRequest[];
  balances: LeaveBalance[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function LeaveManagement({ requests, balances, onApprove, onReject }: LeaveManagementProps) {
  const [filter, setFilter] = useState<string>("All");

  const filtered =
    filter === "All" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-200 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Leave Management</h3>
          <p className="text-xs text-slate-500">Track employee leave requests and balances</p>
        </div>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {balances.map((b, i) => {
          const pct = b.total > 0 ? Math.round((b.used / b.total) * 100) : 0;
          return (
            <div key={i} className="rounded-2xl border border-orange-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  {b.type}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {pct}%
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{b.remaining}</span>
                <span className="text-xs text-slate-400">/ {b.total} days</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">{b.used} used this year</p>
            </div>
          );
        })}
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-orange-200 bg-white overflow-hidden">
        {/* Filter Tabs */}
        <div className="p-4 border-b border-orange-100 flex items-center gap-2 flex-wrap">
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === f
                  ? "bg-orange-100 text-orange-700"
                  : "text-slate-500 hover:bg-orange-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold">Employee</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Dates</th>
                <th className="text-center px-4 py-3 font-semibold">Days</th>
                <th className="text-left px-4 py-3 font-semibold">Reason</th>
                <th className="text-left px-4 py-3 font-semibold">Applied</th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
                <th className="text-center px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-slate-400">
                    No {filter === "All" ? "" : filter.toLowerCase()} leave requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const Icon = typeIcons[r.type] || CalendarRange;
                  return (
                    <tr key={r.leaveId} className="hover:bg-orange-50/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-[10px]">
                            {r.employee.firstName[0]}{r.employee.lastName[0]}
                          </div>
                          <span className="text-xs font-semibold text-slate-800">
                            {r.employee.firstName} {r.employee.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-700">{r.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700">
                          {new Date(r.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          {" — "}
                          {new Date(r.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-slate-700">{r.days}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-500 max-w-[140px] truncate block">{r.reason}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-500">
                          {new Date(r.appliedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusStyles[r.status] || ""}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.status === "Pending" ? (
                          <div className="flex items-center justify-center gap-1">
                            {onApprove && (
                              <button
                                onClick={() => onApprove(r.leaveId)}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                                title="Approve"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onReject && (
                              <button
                                onClick={() => onReject(r.leaveId)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                                title="Reject"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
