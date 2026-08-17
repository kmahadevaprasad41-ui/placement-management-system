"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  AlertCircle,
  FileCheck2,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { EligibilityCard } from "@/components/eligibility/eligibility-card";
import { SessionUser } from "@/types";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [job, setJob] = React.useState<any>(null);
  const [studentEligibility, setStudentEligibility] = React.useState<any | null>(null);
  const [hasApplied, setHasApplied] = React.useState(false);
  const [applicationDetails, setApplicationDetails] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isApplying, setIsApplying] = React.useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = React.useState(false);
  const [overrideReason, setOverrideReason] = React.useState("");
  const [targetOverrideStudentId, setTargetOverrideStudentId] = React.useState("");
  const [isSubmittingOverride, setIsSubmittingOverride] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  const fetchJob = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch(`/api/jobs/${jobId}`);
      if (res.ok) {
        const json = await res.json();
        setJob(json.job);
        setStudentEligibility(json.studentEligibility);
        setHasApplied(json.hasApplied);
        setApplicationDetails(json.applicationDetails);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Application Submitted! 🎉", "Your candidate profile has been shared with the recruiter.");
        fetchJob();
      } else {
        toast.error("Application Blocked", data.error || "Failed to submit application");
      }
    } catch (e) {
      toast.error("Network Error");
    } finally {
      setIsApplying(false);
    }
  };

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOverride(true);
    try {
      const res = await fetch("/api/applications/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: targetOverrideStudentId || currentUser?.studentId,
          jobId,
          reason: overrideReason,
        }),
      });

      if (res.ok) {
        toast.success("Eligibility Overridden", "Candidate is now marked eligible.");
        setIsOverrideModalOpen(false);
        setOverrideReason("");
        fetchJob();
      } else {
        const err = await res.json();
        toast.error("Override failed", err.error);
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsSubmittingOverride(false);
    }
  };

  if (isLoading || !job || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const isStudent = currentUser.role === "STUDENT";
  const canOverride = ["PLACEMENT_OFFICER", "SUPER_ADMIN"].includes(currentUser.role);
  const isRecruiterOrOfficer = ["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Job Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2.5 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                {job.company.logoUrl ? (
                  <img src={job.company.logoUrl} alt={job.company.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="font-extrabold text-xl">{job.company.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{job.title}</h2>
                  <Badge variant="purple" size="sm">
                    ₹{job.ctcLPA} LPA Total CTC
                  </Badge>
                  <Badge variant="blue" size="sm">
                    {job.workMode}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  {job.company.name} • {job.role} • {job.location} • {job.vacancies} Positions
                </p>
              </div>
            </div>

            {/* Student Apply Button */}
            {isStudent && (
              <div>
                {hasApplied ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Application Active ({applicationDetails?.currentStage})</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    isLoading={isApplying}
                    disabled={!studentEligibility?.isEligible}
                    onClick={handleApply}
                    className="gap-2 font-bold shadow-md shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit 1-Click Application</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Job Description & Compensation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">About the Role</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>

              {job.requirements && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-4 mb-2">
                    Requirements & Core Competencies
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Compensation Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Compensation Structure</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                  <p className="text-[11px] text-slate-500">Fixed Base Salary</p>
                  <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                    {job.baseSalaryLPA ? `₹${job.baseSalaryLPA} LPA` : "Standard Base"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900">
                  <p className="text-[11px] text-slate-500">Performance Variable</p>
                  <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                    {job.variableSalaryLPA ? `₹${job.variableSalaryLPA} LPA` : "Performance Bonus"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
                  <p className="text-[11px] text-slate-500">Total CTC Package</p>
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₹{job.ctcLPA} LPA
                  </p>
                </div>
              </div>
            </div>

            {/* Applicants Table for Officers & Recruiters */}
            {isRecruiterOrOfficer && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Registered Candidates ({job.applications.length})
                  </h3>
                  <Link href="/applications">
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage on Kanban $\to$
                    </Button>
                  </Link>
                </div>

                <div className="mt-3 space-y-2">
                  {job.applications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{app.student.user.name}</p>
                        <p className="text-[11px] text-slate-500">{app.student.rollNumber} • {app.student.department.code} • CGPA {app.student.academicRecord?.cgpa || "N/A"}</p>
                      </div>
                      <Badge variant="blue" size="sm">
                        {app.currentStage}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Transparent Eligibility Breakdown Card */}
          <div className="space-y-6">
            {studentEligibility ? (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Eligibility Evaluation
                </h3>
                <EligibilityCard
                  result={studentEligibility}
                  canOverride={canOverride}
                  onOpenOverride={() => setIsOverrideModalOpen(true)}
                />
              </div>
            ) : job.eligibilityRule ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Eligibility Cutoffs
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Minimum CGPA</span>
                    <span className="font-bold text-blue-600">≥ {job.eligibilityRule.minCGPA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Eligible Branches</span>
                    <span className="font-semibold">{job.eligibilityRule.allowedDepartmentCodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Active Backlogs</span>
                    <span className="font-semibold">{job.eligibilityRule.maxActiveBacklogs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">10th / 12th Cutoff</span>
                    <span className="font-semibold">≥ {job.eligibilityRule.minTenthPercentage}% / {job.eligibilityRule.minTwelfthPercentage}%</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Placement Drive Link */}
            {job.drives.length > 0 && (
              <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 dark:border-purple-900 dark:bg-purple-950/20 text-xs">
                <p className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-600" /> Placement Drive Scheduled
                </p>
                <p className="text-purple-700 dark:text-purple-300 mt-1">
                  {job.drives[0].title} on {new Date(job.drives[0].driveDate).toLocaleDateString()}
                </p>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5 font-medium">
                  Venue: {job.drives[0].venue}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Officer Override Modal */}
        <Modal
          isOpen={isOverrideModalOpen}
          onClose={() => setIsOverrideModalOpen(false)}
          title="Placement Officer Eligibility Override"
          description="Grant an exceptional exemption for this student with an immutable audit justification."
        >
          <form onSubmit={handleOverrideSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <p className="font-semibold flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Mandatory Audit Requirement
              </p>
              <p className="mt-0.5">
                Every override is recorded in the institutional audit log with timestamp, operator ID, and justification reason.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Override Justification Reason (Required)
              </label>
              <textarea
                rows={3}
                required
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Cleared backlogs in re-evaluation; exceptional national coding competition finalist."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOverrideModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingOverride}>
                Confirm Override
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
