"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, Search, MapPin, Plus, CheckCircle2, XCircle, Clock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { EligibilityCard } from "@/components/eligibility/eligibility-card";
import { SessionUser } from "@/types";

export default function JobsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [workMode, setWorkMode] = React.useState("");
  const [selectedJobForEligibility, setSelectedJobForEligibility] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (workMode) params.set("workMode", workMode);
      if (activeTab) params.set("tab", activeTab);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setJobs(json.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobs();
  }, [activeTab, workMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  const tabs = currentUser.role === "STUDENT"
    ? [
        { id: "all", label: "All Openings", count: jobs.length },
        { id: "eligible", label: "Eligible for Me" },
        { id: "applied", label: "My Applications" },
        { id: "closing_soon", label: "Closing Soon" },
      ]
    : [{ id: "all", label: "Active Job Listings", count: jobs.length }];

  const canPostJob = ["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Campus Job Openings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified campus placements, compensation packages, and eligibility criteria
            </p>
          </div>

          {canPostJob && (
            <Link href="/jobs/new">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" /> Post New Job
              </Button>
            </Link>
          )}
        </div>

        {/* Tabs for Students */}
        {currentUser.role === "STUDENT" && (
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id)} />
        )}

        {/* Search & Workmode Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search job title, role, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
            >
              <option value="">All Work Modes</option>
              <option value="ON_SITE">On-Site</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>
            <Button type="submit" variant="primary" size="sm" className="text-xs">
              Filter
            </Button>
          </form>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                      {j.company.logoUrl ? (
                        <img src={j.company.logoUrl} alt={j.company.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="font-extrabold text-sm">{j.company.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{j.title}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{j.company.name}</p>
                    </div>
                  </div>

                  <Badge
                    variant={j.ctcLPA >= 20 ? "purple" : j.ctcLPA >= 10 ? "blue" : "secondary"}
                    size="sm"
                  >
                    ₹{j.ctcLPA} LPA
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {j.location}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">{j.workMode}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">{j.jobType}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {j.description}
                </p>

                {/* Eligibility Pill for Student */}
                {currentUser.role === "STUDENT" && j.eligibility && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {j.eligibility.isEligible ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Eligible ({j.eligibility.scorePercentage}%)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                          <XCircle className="w-4 h-4" /> Ineligible ({j.eligibility.scorePercentage}%)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedJobForEligibility(j)}
                      className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Check Rules Breakdown</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Deadline: {new Date(j.deadline).toLocaleDateString()}
                </span>

                <Link href={`/jobs/${j.id}`}>
                  <Button variant="primary" size="sm" className="text-xs">
                    {j.hasApplied ? "View My Application" : "View Details & Apply"}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Eligibility Modal */}
        {selectedJobForEligibility && (
          <Modal
            isOpen={Boolean(selectedJobForEligibility)}
            onClose={() => setSelectedJobForEligibility(null)}
            title={`Eligibility Breakdown: ${selectedJobForEligibility.title}`}
            description={`Evaluated for ${currentUser.name} against ${selectedJobForEligibility.company.name} criteria.`}
          >
            <EligibilityCard result={selectedJobForEligibility.eligibility} />
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
