import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PayrollCard from "../PayrollCard";
import type { PayrollRun } from "@/lib/types";

const mockRuns: PayrollRun[] = [
  { runId: "PR-2026-06", period: "June 2026", employees: 7, amount: "₹1,85,000", status: "Processing" },
  { runId: "PR-2026-05", period: "May 2026", employees: 40, amount: "₹1,75,000", status: "Completed" },
  { runId: "PR-2026-04", period: "April 2026", employees: 40, amount: "₹1,75,000", status: "Completed" },
];

describe("PayrollCard", () => {
  // ── Header ──
  it("renders the header title and subtitle", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("Payroll Executions")).toBeInTheDocument();
    expect(screen.getByText("Manage monthly salary processing runs")).toBeInTheDocument();
  });

  it("renders the Initiate Payroll Run button", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("Initiate Payroll Run")).toBeInTheDocument();
  });

  // ── Payroll Runs ──
  it("renders all payroll run IDs", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("PR-2026-06")).toBeInTheDocument();
    expect(screen.getByText("PR-2026-05")).toBeInTheDocument();
    expect(screen.getByText("PR-2026-04")).toBeInTheDocument();
  });

  it("renders payroll run periods", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("June 2026")).toBeInTheDocument();
    expect(screen.getByText("May 2026")).toBeInTheDocument();
    expect(screen.getByText("April 2026")).toBeInTheDocument();
  });

  it("renders payroll run amounts", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("₹1,85,000")).toBeInTheDocument();
    const amounts = screen.getAllByText("₹1,75,000");
    expect(amounts.length).toBe(2);
  });

  it("renders payroll run status badges", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("Processing")).toBeInTheDocument();
    const completedBadges = screen.getAllByText("Completed");
    expect(completedBadges.length).toBe(2);
  });

  it("shows employee count for each run", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText(/Calculated for 7 registered employees/)).toBeInTheDocument();
    // 40 appears in two runs (May + April)
    const fortyCounts = screen.getAllByText(/Calculated for 40 registered employees/);
    expect(fortyCounts.length).toBe(2);
  });

  it("shows gross payout label for each run", () => {
    render(<PayrollCard runs={mockRuns} />);
    const grossLabels = screen.getAllByText("Gross Payout");
    expect(grossLabels.length).toBe(3);
  });

  // ── Summary Cards ──
  it("renders summary card titles", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("Total Payroll YTD")).toBeInTheDocument();
    expect(screen.getByText("Avg. Salary")).toBeInTheDocument();
    expect(screen.getByText("Next Run")).toBeInTheDocument();
  });

  it("renders summary card values", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("₹5,35,000")).toBeInTheDocument();
    expect(screen.getByText("₹43,750")).toBeInTheDocument();
    expect(screen.getByText("Jul 1, 2026")).toBeInTheDocument();
  });

  it("renders summary card change descriptions", () => {
    render(<PayrollCard runs={mockRuns} />);
    expect(screen.getByText("+12% vs last quarter")).toBeInTheDocument();
    expect(screen.getByText("Per employee/month")).toBeInTheDocument();
    expect(screen.getByText("In 26 days")).toBeInTheDocument();
  });

  // ── SVG Icons ──
  it("renders SVG icons for each summary card", () => {
    const { container } = render(<PayrollCard runs={mockRuns} />);
    const svgs = container.querySelectorAll("svg");
    // At least 3 summary card icons + Plus icon + 3 status icons = 7+ SVGs
    expect(svgs.length).toBeGreaterThanOrEqual(6);
  });
});
