"use client";

import * as React from "react";

interface DepartmentStat {
  code: string;
  name: string;
  totalStudents: number;
  placedStudents: number;
  placementPercentage: number;
  averageCTC: number;
}

interface FunnelStat {
  stage: string;
  count: number;
  percentage: number;
}

interface MetricChartsProps {
  departmentStats: DepartmentStat[];
  funnelStats: FunnelStat[];
  ctcDistribution?: { range: string; count: number }[];
}

export function DepartmentPlacementChart({ stats }: { stats: DepartmentStat[] }) {
  const maxPct = 100;

  return (
    <div className="space-y-4">
      {stats.map((dept) => (
        <div key={dept.code} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">{dept.code}</span>
              <span className="text-slate-400">({dept.placedStudents}/{dept.totalStudents} placed)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Avg ₹{dept.averageCTC.toFixed(1)} LPA</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{dept.placementPercentage}%</span>
            </div>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
              style={{ width: `${dept.placementPercentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecruitmentFunnelChart({ stats }: { stats: FunnelStat[] }) {
  const maxCount = Math.max(...stats.map((s) => s.count), 1);

  return (
    <div className="space-y-3">
      {stats.map((item, idx) => {
        const widthPct = Math.max(18, Math.round((item.count / maxCount) * 100));

        const colors = [
          "bg-blue-600 text-white",
          "bg-blue-500 text-white",
          "bg-indigo-500 text-white",
          "bg-purple-500 text-white",
          "bg-cyan-600 text-white",
          "bg-emerald-600 text-white",
          "bg-green-700 text-white",
        ];

        return (
          <div key={item.stage} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{item.stage}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {item.count} candidates <span className="text-slate-400 font-normal">({item.percentage}%)</span>
              </span>
            </div>
            <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center px-1 overflow-hidden">
              <div
                className={`h-6 rounded-lg ${colors[idx % colors.length]} flex items-center justify-between px-3 text-xs font-bold transition-all duration-500 shadow-sm`}
                style={{ width: `${widthPct}%` }}
              >
                <span>{item.stage}</span>
                <span>{item.count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
