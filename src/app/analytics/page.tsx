"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Award, Users, Building2, CheckCircle2, Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentPlacementChart, RecruitmentFunnelChart } from "@/components/charts/metric-charts";
import { SessionUser } from "@/types";

export default function AnalyticsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [data, setData] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !data || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const { metrics, departmentStats, funnelStats, ctcDistribution } = data;

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Institutional Placement Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live computed statistics across batches, departments, salary bands, and recruitment stages.
            </p>
          </div>
        </div>

        {/* Executive Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Rate</p>
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{metrics.placementRate}%</p>
            <p className="text-xs text-slate-400 mt-0.5">{metrics.placedStudents} of {metrics.totalStudents} Students</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Highest Package</p>
            <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">₹{metrics.highestCTC} LPA</p>
            <p className="text-xs text-slate-400 mt-0.5">Google / Adobe Tier 1</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Package</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">₹{metrics.averageCTC} LPA</p>
            <p className="text-xs text-slate-400 mt-0.5">Median: ₹{metrics.medianCTC} LPA</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offer Acceptance</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{metrics.acceptanceRate}%</p>
            <p className="text-xs text-slate-400 mt-0.5">{metrics.acceptedOffers} Accepted / {metrics.totalOffers} Offers</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Placement by Engineering Department
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time branch conversion rates and average packages
            </p>
            <DepartmentPlacementChart stats={departmentStats} />
          </div>

          {/* Recruitment Funnel */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Recruitment Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Candidate progression across screening, tests, interviews, and selections
            </p>
            <RecruitmentFunnelChart stats={funnelStats} />
          </div>
        </div>

        {/* CTC Distribution Bands */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
            Compensation Tier Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">Distribution of student offers across salary bands</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ctcDistribution.map((band: any) => (
              <div key={band.range} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs font-semibold text-slate-500">{band.range}</p>
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{band.count}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Offers</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
