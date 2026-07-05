"use client";

import { Search, Plus } from "lucide-react";
import type { Employee } from "@/lib/types";
import { statusColors, statusDots } from "@/lib/types";

interface EmployeeTableProps {
  employees: Employee[];
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (q: string) => void;
  onFilterChange: (status: string) => void;
  onAddClick: () => void;
  onEmployeeClick?: (emp: Employee) => void;
}

const FILTERS = ["All", "Active", "Probation", "Terminated"];

export default function EmployeeTable({
  employees,
  searchQuery,
  statusFilter,
  onSearchChange,
  onFilterChange,
  onAddClick,
  onEmployeeClick,
}: EmployeeTableProps) {
  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-xl bg-white border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800 transition placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center bg-white border border-orange-200 rounded-xl p-1 text-xs">
            {FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === status ? "bg-orange-100 text-slate-800 font-semibold" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-semibold text-white transition shadow-md shadow-orange-500/20 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-orange-200 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-orange-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="p-4">Employee</th>
              <th className="p-4">Department</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100 text-sm">
            {employees.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-slate-400">No employees found matching your filters.</td>
              </tr>
            )}
            {employees.map((emp) => (
              <tr key={emp.employeeId} className="hover:bg-orange-50/50 transition cursor-pointer" onClick={() => onEmployeeClick?.(emp)}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-slate-500">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-700">{emp.dept}</td>
                <td className="p-4 text-slate-600">{emp.role}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[emp.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDots[emp.status] || "bg-slate-500"}`} />
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(emp.hireDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
