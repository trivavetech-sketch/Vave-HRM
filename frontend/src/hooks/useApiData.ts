"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as apiService from "@/services/api";
import type { Employee, AttendanceLog, Candidate, PayrollRun, LeaveRequest, LeaveBalance, Notification, ChartBar } from "@/lib/types";

interface ApiState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  isLive: boolean; // true if data came from API, false if mock fallback
}

// ── Employees ──
export function useEmployees() {
  const [state, setState] = useState<ApiState<Employee[]>>({
    data: [],
    loading: true,
    error: null,
    isLive: false,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    apiService.invalidateEmployeesCache();
    try {
      const data = await apiService.fetchEmployees();
      setState({ data, loading: false, error: null, isLive: true });
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err?.message || "Failed to load employees" }));
    }
  }, []);

  useEffect(() => {
    apiService.fetchEmployees().then((data) => {
      setState({ data, loading: false, error: null, isLive: true });
    });
  }, []);

  return { ...state, refresh };
}

// ── Attendance ──
export function useAttendance() {
  const [state, setState] = useState<ApiState<AttendanceLog[]>>({
    data: [],
    loading: true,
    error: null,
    isLive: false,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await apiService.fetchAttendance();
      setState({ data, loading: false, error: null, isLive: true });
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err?.message }));
    }
  }, []);

  useEffect(() => {
    apiService.fetchAttendance().then((data) => {
      setState({ data, loading: false, error: null, isLive: true });
    });
  }, []);

  return { ...state, refresh };
}

// ── Payroll ──
export function usePayroll() {
  const [state, setState] = useState<ApiState<PayrollRun[]>>({
    data: [],
    loading: true,
    error: null,
    isLive: false,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await apiService.fetchPayrollRuns();
      setState({ data, loading: false, error: null, isLive: true });
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err?.message }));
    }
  }, []);

  useEffect(() => {
    apiService.fetchPayrollRuns().then((data) => {
      setState({ data, loading: false, error: null, isLive: true });
    });
  }, []);

  return { ...state, refresh };
}

// ── Candidates ──
export function useCandidates() {
  const [state, setState] = useState<ApiState<Candidate[]>>({
    data: [],
    loading: true,
    error: null,
    isLive: false,
  });

  const addCandidate = useCallback(async (name: string, email?: string, role?: string) => {
    const cand = await apiService.createCandidate(name, email, role);
    setState((s) => ({ ...s, data: [cand, ...s.data] }));
    return cand;
  }, []);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await apiService.fetchCandidates();
      setState({ data, loading: false, error: null, isLive: true });
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err?.message }));
    }
  }, []);

  useEffect(() => {
    apiService.fetchCandidates().then((data) => {
      setState({ data, loading: false, error: null, isLive: true });
    });
  }, []);

  return { ...state, addCandidate, refresh };
}

// ── Leave (mock only — no backend) ──
export function useLeave() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balances] = useState<LeaveBalance[]>(() => apiService.fetchLeaveBalances());

  useEffect(() => {
    setRequests(apiService.fetchLeaveRequests());
  }, []);

  const approve = useCallback((leaveId: string) => {
    setRequests((prev) => prev.map((r) => (r.leaveId === leaveId ? { ...r, status: "Approved" as const } : r)));
  }, []);

  const reject = useCallback((leaveId: string) => {
    setRequests((prev) => prev.map((r) => (r.leaveId === leaveId ? { ...r, status: "Rejected" as const } : r)));
  }, []);

  return { requests, balances, approve, reject };
}

// ── Notifications (mock only) ──
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(apiService.fetchNotifications());
  }, []);

  const add = useCallback((title: string, message: string, type: "info" | "success" | "warning" | "error") => {
    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      title,
      message,
      time: "Just now",
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return { notifications, add, markAllRead };
}

// ── Charts (static) ──
export function useChartBars(): ChartBar[] {
  return apiService.fetchChartBars();
}
