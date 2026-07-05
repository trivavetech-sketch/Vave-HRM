"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { Notification } from "@/lib/types";

const typeStyles: Record<string, string> = {
  info: "bg-sky-50 border-sky-200 text-sky-600",
  success: "bg-emerald-50 border-emerald-200 text-emerald-600",
  warning: "bg-amber-50 border-amber-200 text-amber-600",
  error: "bg-rose-50 border-rose-200 text-rose-600",
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export default function NotificationsDropdown({ notifications, onMarkAllRead }: NotificationsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-slate-600 hover:text-slate-800 relative transition"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white border border-orange-200 rounded-2xl shadow-xl shadow-orange-500/10 z-50 max-h-[70vh] flex flex-col animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100">
            <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={() => { onMarkAllRead(); setOpen(false); }}
                className="flex items-center gap-1 text-[10px] font-semibold text-orange-600 hover:text-orange-700 transition"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcons[n.type] || Info;
                return (
                  <div
                    key={n.id}
                    className={`px-5 py-4 border-b border-orange-50 last:border-0 hover:bg-orange-50/50 transition cursor-pointer ${
                      !n.read ? "bg-orange-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${typeStyles[n.type] || ""}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs ${!n.read ? "font-bold" : "font-semibold"} text-slate-800`}>
                            {n.title}
                          </p>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
