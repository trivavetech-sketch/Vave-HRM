"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import type { ToastAction } from "@/lib/types";

interface ToastNotificationProps {
  action: ToastAction | null;
}

export default function ToastNotification({ action }: ToastNotificationProps) {
  if (!action) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 animate-in ${
        action.type === "success"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200"
      }`}
    >
      {action.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {action.message}
    </div>
  );
}
