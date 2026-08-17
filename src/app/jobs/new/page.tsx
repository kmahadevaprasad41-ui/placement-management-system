"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function NewJobPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [companyId, setCompanyId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [role, setRole] = React.useState("");
  const [workMode, setWorkMode] = React.useState("HYBRID");
  const [jobType, setJobType] = React.useState("FULL_TIME");
  const [location, setLocation] = React.useState("Bangalore / Hyderabad");
  const [ctcLPA, setCtcLPA] = React.useState("16.0");
  const [baseSalaryLPA, setBaseSalaryLPA] = React.useState("12.0");
  const [variableSalaryLPA, setVariableSalaryLPA] = React.useState("4.0");
  const [vacancies, setVacancies] = React.useState("10");
  const [deadline, setDeadline] = React.useState("2026-10-30");
  const [description, setDescription] = React.useState("");
  const [requirements, setRequirements] = React.useState("");

  // Eligibility Rule Builder Fields
  const [minCGPA, setMinCGPA] = React.useState("7.0");
  const [maxActiveBacklogs, setMaxActiveBacklogs] = React.useState("0");
  const [maxHistoryBacklogs, setMaxHistoryBacklogs] = React.useState("1");
  const [selectedDepts, setSelectedDepts] = React.useState<string[]>(["CSE", "IT", "ECE"]);
  const [minTenthPercentage, setMinTenthPercentage] = React.useState("65.0");
  const [minTwelfthPercentage, setMinTwelfthPercentage] = React.useState("65.0");

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  React.useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData.user);
          if (userData.user.companyId) {
            setCompanyId(userData.user.companyId);
          }
        }

        const compRes = await fetch("/api/companies");
        if (compRes.ok) {
          const compData = await compRes.json();
          setCompanies(compData.companies);
          if (compData.companies.length > 0 && !companyId) {
            setCompanyId(compData.companies[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const handleDeptToggle = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          title,
          role: role || title,
          description,
          requirements,
          workMode,
          jobType,
          location,
          ctcLPA,
          baseSalaryLPA,
          variableSalaryLPA,
          vacancies,
          deadline,
          eligibility: {
            minCGPA,
            allowedDepartmentCodes: selectedDepts,
            allowedBatchYears: [2027],
            maxActiveBacklogs,
            maxHistoryBacklogs,
            minTenthPercentage,
            minTwelfthPercentage,
          },
        }),
      });

      if (res.ok) {
        toast.success("Job Published", `${title} opening is now live for eligible candidates.`);
        router.push("/jobs");
      } else {
        const err = await res.json();
        toast.error("Failed to post job", err.error);
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <AppShell user={currentUser}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create Campus Job Opening
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure compensation terms, work models, and eligibility screening rules.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Job Basics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">1. Job Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentUser.role !== "RECRUITER" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cloud Solutions Architect"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                >
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On-Site</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vacancies
                </label>
                <input
                  type="number"
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of the role, core responsibilities, and team..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          {/* 2. Compensation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2. Compensation Terms</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total CTC (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={ctcLPA}
                  onChange={(e) => setCtcLPA(e.target.value)}
                  placeholder="16.0"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Base Salary (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={baseSalaryLPA}
                  onChange={(e) => setBaseSalaryLPA(e.target.value)}
                  placeholder="12.0"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Variable (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={variableSalaryLPA}
                  onChange={(e) => setVariableSalaryLPA(e.target.value)}
                  placeholder="4.0"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* 3. Eligibility Engine Rules */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">3. Eligibility Screening Rules</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Eligible Engineering Departments
              </label>
              <div className="flex flex-wrap gap-2">
                {["CSE", "IT", "ECE", "ME", "EE"].map((dept) => (
                  <button
                    type="button"
                    key={dept}
                    onClick={() => handleDeptToggle(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedDepts.includes(dept)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minimum CGPA Cutoff
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={minCGPA}
                  onChange={(e) => setMinCGPA(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Max Active Backlogs
                </label>
                <input
                  type="number"
                  value={maxActiveBacklogs}
                  onChange={(e) => setMaxActiveBacklogs(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Min 10th / 12th %
                </label>
                <input
                  type="number"
                  value={minTenthPercentage}
                  onChange={(e) => setMinTenthPercentage(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" size="md" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              Publish Opening
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
