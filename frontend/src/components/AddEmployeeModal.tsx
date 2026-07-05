"use client";

import { XCircle } from "lucide-react";
import type { NewEmployeeForm } from "@/lib/types";

interface AddEmployeeModalProps {
  form: NewEmployeeForm;
  show: boolean;
  onClose: () => void;
  onChange: (form: NewEmployeeForm) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddEmployeeModal({ form, show, onClose, onChange, onSubmit }: AddEmployeeModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white border border-orange-200 rounded-2xl p-6 shadow-xl animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900">Create New Employee</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-orange-100 transition">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Verma"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. rahul.v@vave.com"
              value={form.email}
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Department</label>
              <select
                value={form.dept}
                onChange={(e) => onChange({ ...form, dept: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800"
              >
                <option value="">Select Dept</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Job Role</label>
              <input
                type="text"
                required
                placeholder="e.g. QA Automation"
                value={form.role}
                onChange={(e) => onChange({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:border-orange-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Employment Status</label>
            <select
              value={form.status}
              onChange={(e) => onChange({ ...form, status: e.target.value })}
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
  );
}
