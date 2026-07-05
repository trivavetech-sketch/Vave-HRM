import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeTable from "../EmployeeTable";
import type { Employee } from "@/lib/types";

const mockEmployees: Employee[] = [
  {
    employeeId: "emp-001",
    firstName: "Suresh",
    lastName: "Kumar",
    email: "suresh.k@vave.com",
    dept: "Engineering",
    role: "Frontend Lead",
    status: "Active",
    hireDate: "2024-01-15",
    phone: "+91 98765 43210",
  },
  {
    employeeId: "emp-002",
    firstName: "Neha",
    lastName: "Sharma",
    email: "neha.s@vave.com",
    dept: "HR",
    role: "HR Manager",
    status: "Active",
    hireDate: "2024-02-10",
    phone: "+91 98765 43211",
  },
  {
    employeeId: "emp-003",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.s@vave.com",
    dept: "Sales",
    role: "Sales Executive",
    status: "Probation",
    hireDate: "2026-05-15",
    phone: "+91 98765 43214",
  },
];

const defaultProps = {
  employees: mockEmployees,
  searchQuery: "",
  statusFilter: "All",
  onSearchChange: vi.fn(),
  onFilterChange: vi.fn(),
  onAddClick: vi.fn(),
};

/** Find a button in the filter bar by text (disambiguates from status badge with same text) */
function getFilterButton(text: string): HTMLElement | undefined {
  return screen.getAllByText(text).find((el) => el.className.includes("rounded-lg"));
}

describe("EmployeeTable", () => {
  it("renders the table header with all columns", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Joined")).toBeInTheDocument();
  });

  it("renders all employee rows with correct names", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("Suresh Kumar")).toBeInTheDocument();
    expect(screen.getByText("Neha Sharma")).toBeInTheDocument();
    expect(screen.getByText("Vikram Singh")).toBeInTheDocument();
  });

  it("renders employee emails", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("suresh.k@vave.com")).toBeInTheDocument();
    expect(screen.getByText("neha.s@vave.com")).toBeInTheDocument();
  });

  it("renders departments and roles", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("Frontend Lead")).toBeInTheDocument();
    expect(screen.getByText("HR Manager")).toBeInTheDocument();
  });

  it("renders status badges with correct text", () => {
    render(<EmployeeTable {...defaultProps} />);
    // Status appears in both filter buttons and table badges
    const activeInstances = screen.getAllByText("Active");
    expect(activeInstances.length).toBeGreaterThanOrEqual(2);
    const probInstances = screen.getAllByText("Probation");
    expect(probInstances.length).toBeGreaterThanOrEqual(1);
  });

  it("shows empty state message when no employees", () => {
    render(<EmployeeTable {...defaultProps} employees={[]} />);
    expect(screen.getByText("No employees found matching your filters.")).toBeInTheDocument();
  });

  it("renders all filter buttons", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    // "Active", "Probation", "Terminated" also appear as badges — use getAllByText
    expect(screen.getAllByText("Active").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Probation").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Terminated")).toBeInTheDocument();
  });

  it("highlights the active filter", () => {
    render(<EmployeeTable {...defaultProps} statusFilter="Probation" />);
    const filterBtn = getFilterButton("Probation");
    expect(filterBtn).toBeTruthy();
    expect(filterBtn!.className).toContain("bg-orange-100");
  });

  it("calls onSearchChange when typing in search input", async () => {
    const onSearchChange = vi.fn();
    render(<EmployeeTable {...defaultProps} onSearchChange={onSearchChange} />);
    const input = screen.getByPlaceholderText("Search employees...");
    await userEvent.type(input, "suresh");
    expect(onSearchChange).toHaveBeenCalledTimes(6);
    expect(onSearchChange).toHaveBeenLastCalledWith("h");
  });

  it("calls onFilterChange when clicking a filter button", async () => {
    const onFilterChange = vi.fn();
    render(<EmployeeTable {...defaultProps} onFilterChange={onFilterChange} />);
    const filterBtn = getFilterButton("Active");
    expect(filterBtn).toBeTruthy();
    await userEvent.click(filterBtn!);
    expect(onFilterChange).toHaveBeenCalledWith("Active");
  });

  it("calls onAddClick when clicking Add Employee button", async () => {
    const onAddClick = vi.fn();
    render(<EmployeeTable {...defaultProps} onAddClick={onAddClick} />);
    await userEvent.click(screen.getByText("Add Employee"));
    expect(onAddClick).toHaveBeenCalledOnce();
  });

  it("renders search input with the provided value", () => {
    render(<EmployeeTable {...defaultProps} searchQuery="test query" />);
    const input = screen.getByPlaceholderText("Search employees...");
    expect(input).toHaveValue("test query");
  });

  it("renders employee initials in avatar circles", () => {
    render(<EmployeeTable {...defaultProps} />);
    expect(screen.getByText("SK")).toBeInTheDocument();
    expect(screen.getByText("NS")).toBeInTheDocument();
    expect(screen.getByText("VS")).toBeInTheDocument();
  });
});
