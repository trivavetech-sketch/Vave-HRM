"use client";

import { Plus, Camera, Wifi, Download } from "lucide-react";
import type { Candidate, KanbanStage as KanbanStageType } from "@/lib/types";

interface KanbanBoardProps {
  candidates: Candidate[];
  onAddCandidate: () => void;
}

export default function KanbanBoard({ candidates, onAddCandidate }: KanbanBoardProps) {
  const stages: KanbanStageType[] = [
    { name: "Applied", cands: candidates.filter((c) => c.status === "Applied") },
    { name: "Interview Loop", cands: candidates.filter((c) => c.status === "Technical Interview") },
    { name: "Offer Made", cands: candidates.filter((c) => c.status === "Offer Extended") },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">ATS Candidates Pipeline</h3>
          <p className="text-xs text-slate-500">Review applicants undergoing interview loops</p>
        </div>
        <button
          onClick={onAddCandidate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-semibold text-white transition shadow-md shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stages.map((col, idx) => (
          <div key={idx} className="rounded-2xl border border-orange-200 bg-white p-4 flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-4 border-b border-orange-200 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? "bg-slate-400" : idx === 1 ? "bg-orange-400" : "bg-emerald-400"}`} />
                <span className="text-xs font-bold text-slate-700">{col.name}</span>
              </div>
              <span className="text-[10px] bg-orange-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{col.cands.length}</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {col.cands.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <p className="text-xs">No candidates</p>
                  <p className="text-[10px]">Drag or add new</p>
                </div>
              ) : (
                col.cands.map((cand, cIdx) => (
                  <div key={cIdx} className="p-4 rounded-xl bg-orange-50/40 border border-orange-200 hover:border-orange-400 transition cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <h5 className="text-xs font-semibold text-slate-800">{cand.name}</h5>
                      <span className="text-[9px] text-slate-400 group-hover:text-orange-600 font-semibold transition-colors">View</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{cand.role}</p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="truncate">{cand.email}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {[<Camera key="cam" className="w-3 h-3" />, <Wifi key="wifi" className="w-3 h-3" />, <Download key="dl" className="w-3 h-3" />].map((icon, i) => (
                        <span
                          key={i}
                          className="p-1 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 transition cursor-pointer"
                        >
                          {icon}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
