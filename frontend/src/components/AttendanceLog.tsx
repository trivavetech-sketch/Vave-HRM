"use client";

import { Calendar, MapPin, RefreshCw, LogOut } from "lucide-react";
import type { AttendanceLog as AttendanceLogType } from "@/lib/types";

interface AttendanceLogProps {
  logs: AttendanceLogType[];
  onSimulateClockIn: () => void;
  onSimulateCheckOut?: () => void;
}

export default function AttendanceLog({ logs, onSimulateClockIn, onSimulateCheckOut }: AttendanceLogProps) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const checkedIn = logs.filter((l) => !l.checkOut);
  const checkedOut = logs.filter((l) => l.checkOut);

  const summaryStats = [
    { label: "Checked In", value: checkedIn.length, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
    { label: "Checked Out", value: checkedOut.length, color: "text-slate-600", bg: "bg-slate-50 border-slate-200" },
    { label: "On Time", value: logs.filter((l) => l.status === "On Time").length, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
    { label: "Late", value: logs.filter((l) => l.status === "Late").length, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-orange-200 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Daily Clock-In / Out Log</h3>
          <p className="text-xs text-slate-500">Live feed of employee attendance events</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onSimulateClockIn} className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-xl hover:bg-orange-200 font-semibold text-xs transition">
            <RefreshCw className="w-3.5 h-3.5" />
            Simulate Check-in
          </button>
          {onSimulateCheckOut && (
            <button onClick={onSimulateCheckOut} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 font-semibold text-xs transition">
              <LogOut className="w-3.5 h-3.5" />
              Simulate Check-out
            </button>
          )}
          <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-4 py-2 text-xs">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span className="text-slate-600">{today}</span>
          </div>
        </div>
      </div>

      {/* Activity + Geofencing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Log */}
        <div className="rounded-2xl border border-orange-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Activity Log</h4>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {checkedIn.length} in • {checkedOut.length} out
            </span>
          </div>
          <div className="divide-y divide-orange-100 max-h-[400px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No clock-ins yet today.</p>
            ) : (
              logs.map((log) => (
                <div key={log.attendanceId} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs">
                      {log.employee.firstName[0]}{log.employee.lastName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{log.employee.firstName} {log.employee.lastName}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {log.location} • {log.method}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-xs font-semibold text-slate-800">
                          {new Date(log.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <p className={`text-[10px] font-medium ${log.status === "On Time" ? "text-emerald-600" : "text-amber-600"}`}>{log.status}</p>
                      </div>
                      {log.checkOut && (
                        <div className="pl-2 border-l border-orange-200">
                          <span className="text-xs text-slate-400">
                            {new Date(log.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <p className="text-[10px] text-slate-400">Out</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Geofencing */}
        <div className="rounded-2xl border border-orange-200 bg-white p-6 flex flex-col justify-between h-[400px]">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Active Geofencing Zones</h4>
            <p className="text-xs text-slate-500">Real-time status of configured workplace coordinate hubs</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-40 h-40 rounded-full border-2 border-orange-200 flex items-center justify-center animate-pulse">
              <div className="w-32 h-32 rounded-full border-2 border-orange-300 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-orange-50 border-2 border-orange-400 flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { name: "HQ Main Office", radius: "100m", status: "Active", color: "text-emerald-600" },
              { name: "Branch Office", radius: "150m", status: "Active", color: "text-emerald-600" },
              { name: "Remote Zone", radius: "50m", status: "Active", color: "text-emerald-600" },
              { name: "Warehouse", radius: "200m", status: "Inactive", color: "text-slate-400" },
            ].map((zone, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">{zone.name}</p>
                  <span className="text-slate-400">{zone.radius}</span>
                </div>
                <span className={`font-semibold ${zone.color}`}>{zone.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border ${s.bg} flex items-center justify-between`}>
            <span className="text-xs text-slate-600">{s.label}</span>
            <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
