"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { CompanyProfile, NotificationPreferences, RolePermission } from "@/lib/types";
import {
  Building2, Bell, Shield, ChevronLeft, Save, Check, Plus,
  Mail, Smartphone, Globe, MapPin, Phone, Clock, Coins, Calendar,
  Users, UserPlus, UserCog, Briefcase, CalendarRange, BarChart3,
  ChevronRight
} from "lucide-react";

// ─── Constants ───
const STORAGE_KEY = "vave_settings";

const defaultProfile: CompanyProfile = {
  companyName: "Vave Technologies Pvt. Ltd.",
  logo: "V",
  address: "42, Indiranagar Double Road",
  city: "Bangalore",
  state: "Karnataka",
  postalCode: "560038",
  phone: "+91 80 4567 8900",
  email: "hello@vave.com",
  website: "https://vave.com",
  timezone: "Asia/Kolkata (IST, UTC+5:30)",
  currency: "INR (₹)",
  fiscalYearStart: "April",
};

const defaultNotificationPrefs: NotificationPreferences = {
  emailNewEmployee: true,
  emailLeaveRequest: true,
  emailPayrollComplete: true,
  emailCandidateApplied: true,
  emailClockInReminder: false,
  pushNewEmployee: true,
  pushLeaveRequest: true,
  pushPayrollComplete: true,
  pushCandidateApplied: true,
  pushClockInReminder: false,
  smsClockInReminder: true,
  smsLeaveApproved: true,
};

const defaultRoles: RolePermission[] = [
  { roleId: "role-admin", name: "Tenant Administrator", description: "Full system access. Can manage all modules and settings.", color: "bg-orange-100 text-orange-600", employeeCount: 2, permissions: { manageEmployees: true, manageAttendance: true, managePayroll: true, manageRecruitment: true, manageLeave: true, manageSettings: true, viewReports: true, manageUsers: true } },
  { roleId: "role-hr", name: "HR Manager", description: "Manages employees, attendance, leave, and recruitment.", color: "bg-sky-100 text-sky-600", employeeCount: 3, permissions: { manageEmployees: true, manageAttendance: true, managePayroll: false, manageRecruitment: true, manageLeave: true, manageSettings: false, viewReports: true, manageUsers: false } },
  { roleId: "role-manager", name: "Department Manager", description: "View team, approve leave, view reports.", color: "bg-emerald-100 text-emerald-600", employeeCount: 5, permissions: { manageEmployees: false, manageAttendance: true, managePayroll: false, manageRecruitment: false, manageLeave: true, manageSettings: false, viewReports: true, manageUsers: false } },
  { roleId: "role-employee", name: "Employee", description: "Basic self-service: clock in/out, view own data.", color: "bg-purple-100 text-purple-600", employeeCount: 18, permissions: { manageEmployees: false, manageAttendance: false, managePayroll: false, manageRecruitment: false, manageLeave: false, manageSettings: false, viewReports: false, manageUsers: false } },
];

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        profile: { ...defaultProfile, ...parsed.profile },
        notificationPrefs: { ...defaultNotificationPrefs, ...parsed.notificationPrefs },
        roles: parsed.roles ? parsed.roles.map((r: RolePermission, i: number) => ({ ...defaultRoles[i] || r, ...r })) : defaultRoles,
      };
    }
  } catch {}
  return { profile: defaultProfile, notificationPrefs: defaultNotificationPrefs, roles: defaultRoles };
}

function saveSettings(profile: CompanyProfile, notificationPrefs: NotificationPreferences, roles: RolePermission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, notificationPrefs, roles }));
}

// ─── Permission Labels ───
const permissionLabels: { key: keyof RolePermission["permissions"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "manageEmployees", label: "Manage Employees", icon: Users },
  { key: "manageAttendance", label: "Manage Attendance", icon: Clock },
  { key: "managePayroll", label: "Manage Payroll", icon: Coins },
  { key: "manageRecruitment", label: "Manage Recruitment", icon: Briefcase },
  { key: "manageLeave", label: "Manage Leave", icon: CalendarRange },
  { key: "manageSettings", label: "Manage Settings", icon: UserCog },
  { key: "viewReports", label: "View Reports", icon: BarChart3 },
  { key: "manageUsers", label: "Manage Users", icon: UserPlus },
];

// ─── Section Tabs ───
const sections = [
  { id: "profile", label: "Company Profile", icon: Building2 },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "roles", label: "Role Management", icon: Shield },
];

// ────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
        enabled ? "bg-orange-500" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-orange-500 transition"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

// ────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(defaultNotificationPrefs);
  const [roles, setRoles] = useState<RolePermission[]>(defaultRoles);
  const [saved, setSaved] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    const settings = loadSettings();
    setProfile(settings.profile);
    setNotificationPrefs(settings.notificationPrefs);
    setRoles(settings.roles);
  }, [isLoading, isAuthenticated, router]);

  // Save handler
  const handleSave = useCallback(() => {
    saveSettings(profile, notificationPrefs, roles);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [profile, notificationPrefs, roles]);

  // Role permission toggle
  const togglePermission = useCallback((roleId: string, perm: keyof RolePermission["permissions"]) => {
    setRoles((prev) => prev.map((r) =>
      r.roleId === roleId
        ? { ...r, permissions: { ...r.permissions, [perm]: !r.permissions[perm] } }
        : r
    ));
  }, []);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="h-16 border-b border-orange-200 bg-white/90 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl text-slate-600 hover:bg-orange-50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Settings</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {user?.tenantId || "tenant_09ef182b"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-semibold text-white transition shadow-md shadow-orange-500/20"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Section Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-orange-200 pb-4 overflow-x-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeSection === s.id
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "text-slate-500 hover:bg-orange-50 border border-transparent"
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* ──── Company Profile ──── */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            {/* Company Name */}
            <div className="rounded-2xl border border-orange-200 bg-white p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Company Information</h3>
                  <p className="text-[10px] text-slate-500">Basic details about your organization</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-400 to-orange-500 flex items-center justify-center font-bold text-2xl text-white shadow-md flex-shrink-0">
                  {profile.logo || "V"}
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl border border-orange-200 bg-white p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold text-slate-800">Address</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Street Address</label>
                  <input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">City</label>
                  <input type="text" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">State</label>
                  <input type="text" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Postal Code</label>
                  <input type="text" value={profile.postalCode} onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Phone</label>
                  <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition" />
                </div>
              </div>
            </div>

            {/* Contact & Regional */}
            <div className="rounded-2xl border border-orange-200 bg-white p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-800">Contact & Regional Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    <Mail className="w-3 h-3 inline mr-1" /> Email
                  </label>
                  <input type="text" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    <Globe className="w-3 h-3 inline mr-1" /> Website
                  </label>
                  <input type="text" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-orange-500 transition" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    <Clock className="w-3 h-3 inline mr-1" /> Timezone
                  </label>
                  <Select value={profile.timezone} options={["Asia/Kolkata (IST, UTC+5:30)", "Asia/Dubai (GST, UTC+4)", "Asia/Singapore (SGT, UTC+8)", "America/New_York (EST, UTC-5)", "Europe/London (GMT, UTC+0)", "Australia/Sydney (AEST, UTC+10)"]} onChange={(v) => setProfile({ ...profile, timezone: v })} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    <Coins className="w-3 h-3 inline mr-1" /> Currency
                  </label>
                  <Select value={profile.currency} options={["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)", "SGD (S$)", "AED (د.إ)"]} onChange={(v) => setProfile({ ...profile, currency: v })} />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    <Calendar className="w-3 h-3 inline mr-1" /> Fiscal Year Start
                  </label>
                  <Select value={profile.fiscalYearStart} options={["January", "April", "July", "October"]} onChange={(v) => setProfile({ ...profile, fiscalYearStart: v })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──── Notification Preferences ──── */}
        {activeSection === "notifications" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-orange-200 bg-white p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 text-white shadow-md">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Notification Channels</h3>
                  <p className="text-[10px] text-slate-500">Configure how and when notifications are sent</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Email Notifications</span>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "emailNewEmployee" as const, label: "New employee onboarding" },
                    { key: "emailLeaveRequest" as const, label: "Leave request submitted" },
                    { key: "emailPayrollComplete" as const, label: "Payroll run completed" },
                    { key: "emailCandidateApplied" as const, label: "New candidate applies" },
                    { key: "emailClockInReminder" as const, label: "Daily clock-in reminder" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs text-slate-600">{item.label}</span>
                      <Toggle
                        enabled={notificationPrefs[item.key]}
                        onChange={() => setNotificationPrefs({ ...notificationPrefs, [item.key]: !notificationPrefs[item.key] })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Push */}
              <div className="pt-4 border-t border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                    <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Push Notifications</span>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "pushNewEmployee" as const, label: "New employee onboarding" },
                    { key: "pushLeaveRequest" as const, label: "Leave request submitted" },
                    { key: "pushPayrollComplete" as const, label: "Payroll run completed" },
                    { key: "pushCandidateApplied" as const, label: "New candidate applies" },
                    { key: "pushClockInReminder" as const, label: "Daily clock-in reminder" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs text-slate-600">{item.label}</span>
                      <Toggle
                        enabled={notificationPrefs[item.key]}
                        onChange={() => setNotificationPrefs({ ...notificationPrefs, [item.key]: !notificationPrefs[item.key] })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS */}
              <div className="pt-4 border-t border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">SMS Notifications</span>
                </div>
                <div className="space-y-3">
                  {[
                    { key: "smsClockInReminder" as const, label: "Clock-in reminder SMS" },
                    { key: "smsLeaveApproved" as const, label: "Leave approved notification" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs text-slate-600">{item.label}</span>
                      <Toggle
                        enabled={notificationPrefs[item.key]}
                        onChange={() => setNotificationPrefs({ ...notificationPrefs, [item.key]: !notificationPrefs[item.key] })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──── Role Management ──── */}
        {activeSection === "roles" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Roles & Permissions</h3>
                <p className="text-[10px] text-slate-500">Define access levels for different user types</p>
              </div>
              <button
                onClick={() => {
                  const newRole: RolePermission = {
                    roleId: `role-${Date.now()}`,
                    name: "New Role",
                    description: "Custom role",
                    color: "bg-slate-100 text-slate-600",
                    employeeCount: 0,
                    permissions: {
                      manageEmployees: false, manageAttendance: false, managePayroll: false,
                      manageRecruitment: false, manageLeave: false, manageSettings: false,
                      viewReports: false, manageUsers: false,
                    },
                  };
                  setRoles((prev) => [...prev, newRole]);
                  setExpandedRole(newRole.roleId);
                }}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-xs font-semibold text-white transition shadow-md shadow-orange-500/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Role
              </button>
            </div>

            {roles.map((role) => {
              const isExpanded = expandedRole === role.roleId;
              const grantedCount = Object.values(role.permissions).filter(Boolean).length;

              return (
                <div key={role.roleId} className="rounded-2xl border border-orange-200 bg-white overflow-hidden">
                  {/* Role Header */}
                  <button
                    onClick={() => setExpandedRole(isExpanded ? null : role.roleId)}
                    className="w-full flex items-center justify-between p-5 hover:bg-orange-50/50 transition text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${role.color} flex items-center justify-center font-bold text-sm`}>
                        {role.name[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{role.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{role.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {role.employeeCount} employees
                          </span>
                          <span className="text-[9px] text-slate-400 bg-orange-50 px-2 py-0.5 rounded-full">
                            {grantedCount}/8 permissions
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {/* Expanded Permissions */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-orange-100 pt-4">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase mb-3">Permission Toggles</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissionLabels.map((perm) => (
                          <div
                            key={perm.key}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange-200 transition"
                          >
                            <div className="flex items-center gap-2">
                              <perm.icon className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-[11px] font-semibold text-slate-700">{perm.label}</span>
                            </div>
                            <Toggle
                              enabled={role.permissions[perm.key]}
                              onChange={() => togglePermission(role.roleId, perm.key)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
