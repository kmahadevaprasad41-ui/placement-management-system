"use client";

import * as React from "react";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { EligibilityEvaluationResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EligibilityCardProps {
  result: EligibilityEvaluationResult;
  onOpenOverride?: () => void;
  canOverride?: boolean;
}

export function EligibilityCard({ result, onOpenOverride, canOverride = false }: EligibilityCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          {result.isEligible ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <XCircle className="h-5 w-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {result.isEligible ? "Eligible for Application" : "Currently Ineligible"}
              </h4>
              {result.overridden && (
                <Badge variant="purple" size="sm" className="gap-1">
                  <ShieldCheck className="w-3 h-3" /> Overridden
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Matched {result.criteria.filter((c) => c.passed).length} of {result.criteria.length} criteria ({result.scorePercentage}%)
            </p>
          </div>
        </div>

        {/* Override action button for officers */}
        {canOverride && !result.isEligible && (
          <Button variant="outline" size="sm" onClick={onOpenOverride} className="text-xs gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50">
            <ShieldCheck className="w-3.5 h-3.5" /> Override Cutoff
          </Button>
        )}
      </div>

      {result.overridden && result.overrideReason && (
        <div className="mt-3 p-3 rounded-lg bg-purple-50 border border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/40 text-xs text-purple-800 dark:text-purple-300">
          <p className="font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Placement Officer Override Justification:
          </p>
          <p className="mt-0.5 text-purple-700 dark:text-purple-300">{result.overrideReason}</p>
        </div>
      )}

      {/* Transparent Breakdown Criteria List */}
      <div className="mt-4 space-y-2.5">
        {result.criteria.map((c, idx) => (
          <div
            key={idx}
            className={`flex items-start justify-between p-3 rounded-xl border text-xs transition-colors ${
              c.passed
                ? "bg-slate-50/70 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800"
                : "bg-rose-50/40 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {c.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{c.label}</p>
                {c.notes && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{c.notes}</p>}
              </div>
            </div>

            <div className="text-right shrink-0 ml-3">
              <p className="text-[11px] text-slate-500">Required: <span className="font-medium text-slate-700 dark:text-slate-300">{c.required}</span></p>
              <p className={`font-bold text-xs ${c.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                Actual: {c.actual}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
