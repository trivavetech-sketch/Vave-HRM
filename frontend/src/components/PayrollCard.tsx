"use client";

import { Plus, CheckCircle, AlertCircle, DollarSign, TrendingUp, Calendar } from "lucide-react";
import type { PayrollRun } from "@/lib/types";

interface PayrollCardProps {
  runs: PayrollRun[];
}

export default function PayrollCard({ runs }: PayrollCardProps) {
  const summaryCards = [
    { label: "Total Payroll YTD", value: "₹5,35,000", change: "+12% vs last quarter", icon: DollarSign },
    { label: "Avg. Salary", value: "₹43,750", change: "Per employee/month", icon: TrendingUp },
    { label: "Next Run", value: "Jul 1, 2026", change: "In 26 days", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Payroll Executions</h3>
          <p className="text-xs text-slate-500">Manage monthly salary processing runs</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-semibold text-white transition shadow-md shadow-orange-500/20">
          <Plus className="w-4 h-4" />
          Initiate Payroll Run
        </button>
      </div>

      {/* Runs */}
      {runs.map((run) => (
        <div
          key={run.runId}
          className="p-6 rounded-2xl bg-white border border-orange-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md hover:shadow-orange-500/5 transition-shadow"
        >
          <div>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider">{run.runId}</span>
            <h4 className="text-base font-bold text-slate-800 mt-0.5">{run.period}</h4>
            <p className="text-xs text-slate-600 mt-1">Calculated for {run.employees} registered employees</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs text-slate-500">Gross Payout</span>
              <p className="text-lg font-bold text-slate-800 mt-0.5">{run.amount}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  run.status === "Completed"
                    ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                    : "bg-orange-100 text-orange-600 border border-orange-500/20 animate-pulse"
                }`}
              >
                {run.status === "Completed" ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {run.status}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-orange-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">{card.label}</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{card.value}</p>
              <span className="text-[10px] text-slate-600">{card.change}</span>
            </div>
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
