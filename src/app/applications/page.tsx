"use client";

import * as React from "react";
import Link from "next/link";
import { Layers, LayoutGrid, List, Filter, Search, ChevronRight, ShieldCheck, Download } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationKanban } from "@/components/kanban/application-kanban";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function ApplicationsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [applications, setApplications] = React.useState<any[]>([]);
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban");
  const [stageFilter, setStageFilter] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const toast = useToast();

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const params = new URLSearchParams();
      if (stageFilter) params.set("stage", stageFilter);

      const res = await fetch(`/api/applications?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setApplications(json.applications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApplications();
  }, [stageFilter]);

  const handleStageChange = async (applicationId: string, newStage: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (res.ok) {
        toast.success("Stage Progressed", `Candidate moved to ${newStage}`);
        fetchApplications();
      }
    } catch (e) {
      toast.error("Failed to advance stage");
    }
  };

  const filteredApps = applications.filter((app) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      app.student.user.name.toLowerCase().includes(q) ||
      app.student.rollNumber.toLowerCase().includes(q) ||
      app.job.title.toLowerCase().includes(q) ||
      app.job.company.name.toLowerCase().includes(q)
    );
  });

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const canManage = ["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Recruitment Applications & Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-stage recruitment workflow from initial screening to selection & joining
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Data Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search candidate, roll no, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs font-medium w-full sm:w-auto"
            >
              <option value="">All Recruitment Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="TEST">Assessment / Test</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected</option>
              <option value="OFFERED">Offer Released</option>
              <option value="JOINED">Joined</option>
            </select>

            <span className="text-xs text-slate-400 whitespace-nowrap font-medium">
              {filteredApps.length} Candidates
            </span>
          </div>
        </div>

        {/* View Mode: Kanban vs Table */}
        {viewMode === "kanban" ? (
          <ApplicationKanban
            applications={filteredApps}
            onStageChange={handleStageChange}
            canManage={canManage}
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Current Stage</th>
                    <th className="py-3 px-4">Applied Date</th>
                    {canManage && <th className="py-3 px-4 text-right">Stage Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={app.student.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${app.student.user.name}`}
                            alt={app.student.user.name}
                            className="w-8 h-8 rounded-full bg-slate-100 object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{app.student.user.name}</p>
                            <p className="text-[11px] text-slate-500">{app.student.department.code} • CGPA {app.student.academicRecord?.cgpa || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {app.student.rollNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{app.job.company.name}</p>
                        <p className="text-[11px] text-slate-500">{app.job.title}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{app.job.ctcLPA} LPA
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="blue" size="sm">
                          {app.currentStage}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      {canManage && (
                        <td className="py-3 px-4 text-right">
                          <select
                            value={app.currentStage}
                            onChange={(e) => handleStageChange(app.id, e.target.value)}
                            className="py-1 px-2 rounded-lg border border-slate-200 text-xs bg-white dark:bg-slate-800"
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="TEST">Test</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="SELECTED">Selected</option>
                            <option value="OFFERED">Offered</option>
                            <option value="JOINED">Joined</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
