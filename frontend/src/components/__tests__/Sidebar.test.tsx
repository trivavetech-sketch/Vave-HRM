import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "../Sidebar";
import type { AuthUser } from "@/context/AuthContext";

const mockUser: AuthUser = {
  name: "Rahul Verma",
  email: "rahul.v@vave.com",
  role: "HR Manager",
  initials: "RV",
  tenantId: "tenant_abc123",
};

const defaultProps = {
  activeTab: "Dashboard",
  isMobileMenuOpen: false,
  user: mockUser,
  onTabChange: vi.fn(),
  onCloseMobile: vi.fn(),
  onLogout: vi.fn(),
};

describe("Sidebar", () => {
  // ── Brand ──
  it("renders the brand logo", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("V")).toBeInTheDocument();
    expect(screen.getByText("Vave HRM")).toBeInTheDocument();
    expect(screen.getByText("Enterprise SaaS")).toBeInTheDocument();
  });

  // ── Nav Items ──
  it("renders all 6 navigation items", () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("Leave")).toBeInTheDocument();
    expect(screen.getByText("Payroll")).toBeInTheDocument();
    expect(screen.getByText("Recruitment")).toBeInTheDocument();
  });

  it("renders chevron and nav icons for each nav item", () => {
    const { container } = render(<Sidebar {...defaultProps} />);
    // Each nav button has 2 SVGs (nav icon + ChevronRight) = 12 total
    const svgs = container.querySelectorAll("nav button svg");
    expect(svgs.length).toBe(12);
  });

  it("highlights the active tab with orange styling", () => {
    render(<Sidebar {...defaultProps} activeTab="Employees" />);
    const empBtn = screen.getByText("Employees").closest("button");
    expect(empBtn!.className).toContain("bg-orange-100");
    expect(empBtn!.className).toContain("text-orange-600");
    expect(empBtn!.className).toContain("border-l-2");
    expect(empBtn!.className).toContain("border-orange-500");
  });

  it("applies inactive styling to non-active tabs", () => {
    render(<Sidebar {...defaultProps} activeTab="Dashboard" />);
    const empBtn = screen.getByText("Employees").closest("button");
    expect(empBtn!.className).toContain("text-slate-600");
    expect(empBtn!.className).not.toContain("bg-orange-100");
  });

  it("calls onTabChange and onCloseMobile when clicking a nav item", async () => {
    const onTabChange = vi.fn();
    const onCloseMobile = vi.fn();
    render(<Sidebar {...defaultProps} onTabChange={onTabChange} onCloseMobile={onCloseMobile} />);
    await userEvent.click(screen.getByText("Payroll"));
    expect(onTabChange).toHaveBeenCalledWith("Payroll");
    expect(onCloseMobile).toHaveBeenCalledOnce();
  });

  // ── User Profile ──
  it("displays user initials when user is provided", () => {
    render(<Sidebar {...defaultProps} user={mockUser} />);
    expect(screen.getByText("RV")).toBeInTheDocument();
  });

  it("displays fallback initials when user is null", () => {
    render(<Sidebar {...defaultProps} user={null} />);
    expect(screen.getByText("NS")).toBeInTheDocument();
  });

  it("displays user name when user is provided", () => {
    render(<Sidebar {...defaultProps} user={mockUser} />);
    expect(screen.getByText("Rahul Verma")).toBeInTheDocument();
  });

  it("displays fallback name when user is null", () => {
    render(<Sidebar {...defaultProps} user={null} />);
    expect(screen.getByText("Neha Sharma")).toBeInTheDocument();
  });

  it("displays user role when user is provided", () => {
    render(<Sidebar {...defaultProps} user={mockUser} />);
    expect(screen.getByText("HR Manager")).toBeInTheDocument();
  });

  it("displays fallback role when user is null", () => {
    render(<Sidebar {...defaultProps} user={null} />);
    expect(screen.getByText("Tenant Administrator")).toBeInTheDocument();
  });

  // ── Logout ──
  it("renders the logout button with title", () => {
    render(<Sidebar {...defaultProps} />);
    const logoutBtn = screen.getByTitle("Sign out");
    expect(logoutBtn).toBeInTheDocument();
  });

  it("calls onLogout when clicking the logout button", async () => {
    const onLogout = vi.fn();
    render(<Sidebar {...defaultProps} onLogout={onLogout} />);
    await userEvent.click(screen.getByTitle("Sign out"));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  // ── Mobile Menu ──
  it("applies translate-x-0 class when mobile menu is open", () => {
    const { container } = render(<Sidebar {...defaultProps} isMobileMenuOpen={true} />);
    const aside = container.querySelector("aside");
    expect(aside!.className).toContain("translate-x-0");
  });

  it("applies -translate-x-full class when mobile menu is closed", () => {
    const { container } = render(<Sidebar {...defaultProps} isMobileMenuOpen={false} />);
    const aside = container.querySelector("aside");
    expect(aside!.className).toContain("-translate-x-full");
  });

  it("always applies md:translate-x-0 for desktop visibility", () => {
    const { container } = render(<Sidebar {...defaultProps} />);
    const aside = container.querySelector("aside");
    expect(aside!.className).toContain("md:translate-x-0");
  });
});
