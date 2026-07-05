"use client";

import { ChevronRight, LogOut, Layers, Users, Clock, DollarSign, Briefcase, CalendarRange } from "lucide-react";
import type { AuthUser } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", icon: Layers },
  { name: "Employees", icon: Users },
  { name: "Attendance", icon: Clock },
  { name: "Leave", icon: CalendarRange },
  { name: "Payroll", icon: DollarSign },
  { name: "Recruitment", icon: Briefcase },
];

interface SidebarProps {
  activeTab: string;
  isMobileMenuOpen: boolean;
  user: AuthUser | null;
  onTabChange: (tab: string) => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, isMobileMenuOpen, user, onTabChange, onCloseMobile, onLogout }: SidebarProps) {
  return (
    <aside
      className={`fixed md:relative z-50 w-64 h-screen border-r border-orange-200 bg-white/95 backdrop-blur-md flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-orange-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/20">
            V
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Vave HRM</h1>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Enterprise SaaS</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { onTabChange(item.name); onCloseMobile(); }}
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

      {/* Profile */}
      <div className="p-4 border-t border-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white">
            {user?.initials || "NS"}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">{user?.name || "Neha Sharma"}</p>
            <p className="text-[10px] text-slate-500">{user?.role || "Tenant Administrator"}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-orange-50 transition"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
