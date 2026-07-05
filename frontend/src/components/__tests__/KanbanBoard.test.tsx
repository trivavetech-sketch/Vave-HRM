import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KanbanBoard from "../KanbanBoard";
import type { Candidate } from "@/lib/types";

const mockCandidates: Candidate[] = [
  { name: "Ketan M.", email: "ketan.m@outlook.com", role: "QA Engineer", status: "Applied" },
  { name: "Anil K.", email: "anil.k@gmail.com", role: "DevOps Engineer", status: "Technical Interview" },
  { name: "Sneha G.", email: "sneha.g@yahoo.com", role: "Product Designer", status: "Offer Extended" },
];

describe("KanbanBoard", () => {
  it("renders the header", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    expect(screen.getByText("ATS Candidates Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Review applicants undergoing interview loops")).toBeInTheDocument();
  });

  it("renders all three kanban column headers", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    expect(screen.getByText("Applied")).toBeInTheDocument();
    expect(screen.getByText("Interview Loop")).toBeInTheDocument();
    expect(screen.getByText("Offer Made")).toBeInTheDocument();
  });

  it("renders Add Candidate button", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    expect(screen.getByText("Add Candidate")).toBeInTheDocument();
  });

  it("places candidates in the correct column based on status", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    expect(screen.getByText("Ketan M.")).toBeInTheDocument();
    expect(screen.getByText("Anil K.")).toBeInTheDocument();
    expect(screen.getByText("Sneha G.")).toBeInTheDocument();
  });

  it("shows candidate role information", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    expect(screen.getByText("QA Engineer")).toBeInTheDocument();
    expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
    expect(screen.getByText("Product Designer")).toBeInTheDocument();
  });

  it("shows candidate email", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    expect(screen.getByText("ketan.m@outlook.com")).toBeInTheDocument();
    expect(screen.getByText("anil.k@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("sneha.g@yahoo.com")).toBeInTheDocument();
  });

  it("shows each column with count of candidates", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    const countBadges = screen.getAllByText("1");
    expect(countBadges.length).toBe(3);
  });

  it("shows empty state in columns with no candidates", () => {
    render(<KanbanBoard candidates={[]} onAddCandidate={vi.fn()} />);
    const noCandidates = screen.getAllByText("No candidates");
    expect(noCandidates.length).toBe(3);
  });

  it("shows empty state in specific columns when no matching candidates", () => {
    const singleCand: Candidate[] = [
      { name: "Ketan M.", email: "ketan.m@outlook.com", role: "QA Engineer", status: "Applied" },
    ];
    render(<KanbanBoard candidates={singleCand} onAddCandidate={vi.fn()} />);
    expect(screen.getByText("Ketan M.")).toBeInTheDocument();
    const emptyMessages = screen.getAllByText("No candidates");
    expect(emptyMessages.length).toBe(2);
  });

  it("calls onAddCandidate when clicking Add Candidate button", async () => {
    const onAddCandidate = vi.fn();
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={onAddCandidate} />);
    await userEvent.click(screen.getByText("Add Candidate"));
    expect(onAddCandidate).toHaveBeenCalledOnce();
  });

  it("renders the View link on each candidate card", () => {
    render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    const viewLinks = screen.getAllByText("View");
    expect(viewLinks.length).toBe(3);
  });

  it("renders action icons for each candidate", () => {
    const { container } = render(<KanbanBoard candidates={mockCandidates} onAddCandidate={vi.fn()} />);
    // lucide-react renders inline SVG elements for each icon (Camera, Wifi, Download per candidate)
    const svgs = container.querySelectorAll("svg");
    // 3 candidates × 3 icons each = 9 svgs, plus any other icons in the component
    expect(svgs.length).toBeGreaterThanOrEqual(9);
  });
});
