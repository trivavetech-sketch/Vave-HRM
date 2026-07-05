"use client";

import { X, Mail, Phone, Calendar, Briefcase, Building, BadgeCheck, Shield, MapPin } from "lucide-react";
import type { Employee } from "@/lib/types";

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export default function EmployeeDetailModal({ employee, onClose }: EmployeeDetailModalProps) {
  if (!employee) return null;

  const infoRows = [
    { icon: Mail, label: "Email", value: employee.email },
    { icon: Phone, label: "Phone", value: employee.phone },
    { icon: Building, label: "Department", value: employee.dept },
    { icon: Briefcase, label: "Role", value: employee.role },
    { icon: Calendar, label: "Hired", value: new Date(employee.hireDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
    { icon: MapPin, label: "Location", value: "Bangalore, India" },
  ];

  const statusColor =
    employee.status === "Active"
      ? "bg-emerald-100 text-emerald-600 border-emerald-200"
      : employee.status === "Probation"
      ? "bg-amber-100 text-amber-600 border-amber-200"
      : "bg-rose-100 text-rose-600 border-rose-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-orange-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-orange-50 hover:text-slate-600 transition z-10">
          <X className="w-4 h-4" />
        </button>

        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-6 pb-24 rounded-t-2xl relative">
          <div className="absolute inset-0 bg-white/10 rounded-t-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl text-white shadow-lg border border-white/30">
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                  {employee.status}
                </span>
                <span className="text-xs text-white/70">ID: {employee.employeeId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="px-6 -mt-16 relative z-20 pb-6">
          <div className="bg-white rounded-xl border border-orange-200 shadow-sm divide-y divide-orange-100">
            {infoRows.map((row, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <row.icon className="w-4 h-4 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{row.label}</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-semibold">
              <Shield className="w-3 h-3" />
              Verified
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-semibold">
              <BadgeCheck className="w-3 h-3" />
              Onboarded
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
              <Calendar className="w-3 h-3" />
              {Math.floor((Date.now() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months tenure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
