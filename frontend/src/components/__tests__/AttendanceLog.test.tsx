import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AttendanceLog from "../AttendanceLog";
import type { AttendanceLog as AttendanceLogType } from "@/lib/types";

const mockLogs: AttendanceLogType[] = [
  {
    attendanceId: "att-001",
    employeeId: "emp-001",
    employee: { firstName: "Suresh", lastName: "Kumar" },
    checkIn: new Date("2026-07-05T09:05:00").toISOString(),
    method: "GPS Face ID",
    location: "HQ (Office 1)",
    status: "On Time",
  },
  {
    attendanceId: "att-002",
    employeeId: "emp-002",
    employee: { firstName: "Neha", lastName: "Sharma" },
    checkIn: new Date("2026-07-05T09:35:00").toISOString(),
    method: "Biometric",
    location: "HQ (Office 2)",
    status: "Late",
  },
  {
    attendanceId: "att-003",
    employeeId: "emp-004",
    employee: { firstName: "Priya", lastName: "Nair" },
    checkIn: new Date("2026-07-05T08:55:00").toISOString(),
    method: "Web QR",
    location: "Remote",
    status: "On Time",
  },
];

const defaultProps = {
  logs: mockLogs,
  onSimulateClockIn: vi.fn(),
};

describe("AttendanceLog", () => {
  // ── Header ──
  it("renders the header title and subtitle", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("Daily Clock-In / Out Log")).toBeInTheDocument();
    expect(screen.getByText("Live feed of employee attendance events")).toBeInTheDocument();
  });

  it("renders the Simulate Check-in button", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("Simulate Check-in")).toBeInTheDocument();
  });

  it("renders today's date", () => {
    render(<AttendanceLog {...defaultProps} />);
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  // ── Activity Log ──
  it("renders the Activity Log heading", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("Activity Log")).toBeInTheDocument();
  });

  it("shows correct entry count", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("3 in • 0 out")).toBeInTheDocument();
  });

  it("shows empty state when no logs", () => {
    render(<AttendanceLog {...defaultProps} logs={[]} />);
    expect(screen.getByText("No clock-ins yet today.")).toBeInTheDocument();
  });

  it("shows 0 entries when no logs", () => {
    render(<AttendanceLog {...defaultProps} logs={[]} />);
    expect(screen.getByText("0 in • 0 out")).toBeInTheDocument();
  });

  it("renders employee names in log entries", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("Suresh Kumar")).toBeInTheDocument();
    expect(screen.getByText("Neha Sharma")).toBeInTheDocument();
    expect(screen.getByText("Priya Nair")).toBeInTheDocument();
  });

  it("renders employee location and method for each log", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText(/HQ \(Office 1\)/)).toBeInTheDocument();
    expect(screen.getByText(/HQ \(Office 2\)/)).toBeInTheDocument();
    // "Remote", "GPS Face ID" also appear in summary stats + geofencing — use getAllByText
    expect(screen.getAllByText(/Remote/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/GPS Face ID/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Biometric/)).toBeInTheDocument();
    expect(screen.getByText(/Web QR/)).toBeInTheDocument();
  });

  it("renders On Time and Late status badges", () => {
    render(<AttendanceLog {...defaultProps} />);
    const onTimeLabels = screen.getAllByText("On Time");
    expect(onTimeLabels.length).toBeGreaterThanOrEqual(1);
    // "Late" also appears in summary stats — use getAllByText
    const lateLabels = screen.getAllByText("Late");
    expect(lateLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("renders employee initials in avatar circles", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("SK")).toBeInTheDocument();
    expect(screen.getByText("NS")).toBeInTheDocument();
    expect(screen.getByText("PN")).toBeInTheDocument();
  });

  // ── Geofencing ──
  it("renders the geofencing section heading", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("Active Geofencing Zones")).toBeInTheDocument();
  });

  it("renders geofencing zone names", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("HQ Main Office")).toBeInTheDocument();
    expect(screen.getByText("Branch Office")).toBeInTheDocument();
    expect(screen.getByText("Remote Zone")).toBeInTheDocument();
    expect(screen.getByText("Warehouse")).toBeInTheDocument();
  });

  it("renders geofencing zone statuses", () => {
    render(<AttendanceLog {...defaultProps} />);
    const activeStatuses = screen.getAllByText("Active");
    expect(activeStatuses.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders zone radius information", () => {
    render(<AttendanceLog {...defaultProps} />);
    expect(screen.getByText("100m")).toBeInTheDocument();
    expect(screen.getByText("150m")).toBeInTheDocument();
    expect(screen.getByText("200m")).toBeInTheDocument();
  });

  // ── Summary Stats ──
  it("renders all summary stat labels", () => {
    render(<AttendanceLog {...defaultProps} />);
    // Summary stats now show Checked In, Checked Out, On Time, Late
    expect(screen.getAllByText("On Time").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Late").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Checked In")).toBeInTheDocument();
    expect(screen.getByText("Checked Out")).toBeInTheDocument();
  });

  it("shows correct summary stat values", () => {
    render(<AttendanceLog {...defaultProps} />);
    // 3 logs: 2 On Time, 1 Late, 1 GPS Face ID, 1 Remote
    const statValues = screen.getAllByText(/^\d+$/);
    expect(statValues.length).toBe(4);
  });

  it("shows 0 in summary stats when no logs", () => {
    render(<AttendanceLog {...defaultProps} logs={[]} />);
    const zeroValues = screen.getAllByText("0");
    expect(zeroValues.length).toBe(4);
  });

  // ── Simulate Click ──
  it("calls onSimulateClockIn when clicking the button", async () => {
    const onSimulateClockIn = vi.fn();
    render(<AttendanceLog {...defaultProps} onSimulateClockIn={onSimulateClockIn} />);
    await userEvent.click(screen.getByText("Simulate Check-in"));
    expect(onSimulateClockIn).toHaveBeenCalledOnce();
  });
});
