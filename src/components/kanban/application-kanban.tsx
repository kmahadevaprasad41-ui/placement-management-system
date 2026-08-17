"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, User, Building2, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationCardItem {
  id: string;
  student: {
    id: string;
    rollNumber: string;
    user: { name: string; avatarUrl?: string | null };
    department: { code: string };
    academicRecord?: { cgpa: number } | null;
  };
  job: {
    id: string;
    title: string;
    company: { name: string; logoUrl?: string | null };
    ctcLPA: number;
  };
  currentStage: string;
  appliedAt: string;
}

interface ApplicationKanbanProps {
  applications: ApplicationCardItem[];
  onStageChange: (applicationId: string, newStage: string) => Promise<void>;
  canManage?: boolean;
}

const STAGES = [
  { id: "APPLIED", label: "Applied", color: "border-slate-300 bg-slate-50 dark:bg-slate-900" },
  { id: "SHORTLISTED", label: "Shortlisted", color: "border-blue-300 bg-blue-50/40 dark:bg-blue-950/20" },
  { id: "TEST", label: "Assessment / Test", color: "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20" },
  { id: "INTERVIEW", label: "Interviews", color: "border-purple-300 bg-purple-50/40 dark:bg-purple-950/20" },
  { id: "SELECTED", label: "Selected", color: "border-cyan-300 bg-cyan-50/40 dark:bg-cyan-950/20" },
  { id: "OFFERED", label: "Offer Released", color: "border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20" },
  { id: "JOINED", label: "Joined", color: "border-green-400 bg-green-50/50 dark:bg-green-950/30" },
];

export function ApplicationKanban({ applications, onStageChange, canManage = true }: ApplicationKanbanProps) {
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleAdvance = async (appId: string, currentStage: string) => {
    const currentIdx = STAGES.findIndex((s) => s.id === currentStage);
    if (currentIdx < STAGES.length - 1) {
      const nextStage = STAGES[currentIdx + 1].id;
      setUpdatingId(appId);
      try {
        await onStageChange(appId, nextStage);
      } finally {
        setUpdatingId(null);
      }
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
      {STAGES.map((stage) => {
        const stageApps = applications.filter((a) => a.currentStage === stage.id);

        return (
          <div
            key={stage.id}
            className="flex flex-col w-72 shrink-0 rounded-2xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/50"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{stage.label}</span>
                <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-700 dark:text-slate-300">
                  {stageApps.length}
                </span>
              </div>
            </div>

            {/* Application Cards */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh] p-0.5">
              {stageApps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400">
                  No applicants in this stage
                </div>
              ) : (
                stageApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={app.student.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${app.student.user.name}`}
                          alt={app.student.user.name}
                          className="w-7 h-7 rounded-full bg-slate-100 object-cover shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                            {app.student.user.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {app.student.rollNumber} • {app.student.department.code}
                          </p>
                        </div>
                      </div>
                      <Badge variant="blue" size="sm" className="text-[10px]">
                        {app.student.academicRecord?.cgpa ? `${app.student.academicRecord.cgpa} CGPA` : "N/A"}
                      </Badge>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{app.job.company.name}</span>
                        <span className="text-slate-400"> • ₹{app.job.ctcLPA} LPA</span>
                      </div>
                    </div>

                    {canManage && stage.id !== "JOINED" && (
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={updatingId === app.id}
                          onClick={() => handleAdvance(app.id, app.currentStage)}
                          className="text-[11px] h-7 px-2 text-blue-600 hover:text-blue-700 gap-1 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        >
                          <span>Advance</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
