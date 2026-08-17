"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { ProfileCompletionBreakdown } from "@/types";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface ProfileCompletionWidgetProps {
  breakdown: ProfileCompletionBreakdown;
}

export function ProfileCompletionWidget({ breakdown }: ProfileCompletionWidgetProps) {
  const missingCategories = breakdown.categories.filter((c) => !c.completed);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Profile Readiness</h3>
        </div>
        <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
          {breakdown.totalPercentage}%
        </span>
      </div>

      <Progress
        value={breakdown.totalPercentage}
        color={breakdown.totalPercentage >= 90 ? "emerald" : breakdown.totalPercentage >= 70 ? "blue" : "amber"}
        size="md"
      />

      {missingCategories.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Action items to reach 100%:
          </p>
          <div className="space-y-1.5">
            {missingCategories.slice(0, 2).map((c) => (
              <div
                key={c.name}
                className="flex items-start gap-2 p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-300"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{c.actionRequired}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/students/me"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Update profile details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile is 100% complete and ready for all campus drives!</span>
        </div>
      )}
    </div>
  );
}
