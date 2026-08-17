"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Briefcase,
  Layers,
  CalendarDays,
  Award,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Video,
  FileCheck2,
  Megaphone,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCompletionWidget } from "@/components/student/profile-completion-widget";
import { DepartmentPlacementChart, RecruitmentFunnelChart } from "@/components/charts/metric-charts";
import { SessionUser } from "@/types";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      setCurrentUser(userData.user);

      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const dashboardJson = await res.json();
        setData(dashboardJson);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <AppShell user={currentUser}>
      {/* 1. STUDENT VIEW */}
      {currentUser.role === "STUDENT" && data && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  {data.student.placementStatus === "PLACED"
                    ? "Placement Secured 🎉"
                    : data.student.placementStatus === "IN_PROCESS"
                    ? "Recruitment In Progress"
                    : "Ready for Applications"}
                </span>
                <h2 className="text-2xl font-bold tracking-tight">
                  Welcome back, {currentUser.name}!
                </h2>
                <p className="text-blue-100 text-xs mt-1">
                  Roll No: <span className="font-semibold text-white">{data.student.rollNumber}</span> • {data.student.department.name} • CGPA: {data.student.academicRecord?.cgpa || "N/A"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/jobs">
                  <Button variant="secondary" size="sm" className="font-bold">
                    Browse Eligible Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eligible Jobs</p>
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{data.stats.availableJobs}</p>
              <p className="text-[11px] text-slate-400 mt-1">Active openings matching profile</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applications</p>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{data.stats.totalApplications}</p>
              <p className="text-[11px] text-slate-400 mt-1">Under review across companies</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interviews</p>
                <Video className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{data.stats.activeInterviews}</p>
              <p className="text-[11px] text-slate-400 mt-1">Scheduled technical & HR rounds</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers Received</p>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{data.stats.totalOffers}</p>
              <p className="text-[11px] text-slate-400 mt-1">Official compensation packages</p>
            </div>
          </div>

          {/* Student Profile Readiness + Recent Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ProfileCompletionWidget breakdown={data.profileBreakdown} />

              {/* Campus Announcements */}
              <div className="mt-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Notice Board</h4>
                  </div>
                  <Link href="/announcements" className="text-[11px] font-semibold text-blue-600 hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-3 space-y-3">
                  {data.announcements.map((a: any) => (
                    <div key={a.id} className="text-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant={a.priority === "URGENT" ? "destructive" : "blue"} size="sm">
                          {a.priority}
                        </Badge>
                        <span className="text-[10px] text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{a.title}</p>
                      <p className="text-slate-500 line-clamp-2 mt-0.5">{a.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Applications & Upcoming Interviews */}
            <div className="lg:col-span-2 space-y-6">
              {/* Offers Banner if any */}
              {data.offers.length > 0 && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-emerald-900/40">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Your Placement Offers</h4>
                    </div>
                    <Link href="/offers">
                      <Button variant="outline" size="sm" className="text-xs bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100">
                        Manage Offers
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 space-y-2">
                    {data.offers.map((off: any) => (
                      <div key={off.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{off.company.name}</p>
                          <p className="text-[11px] text-slate-500">{off.job.title} • ₹{off.ctcLPA} LPA</p>
                        </div>
                        <Badge variant={off.status === "ACCEPTED" ? "success" : "purple"} size="sm">
                          {off.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Applications */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Recent Applications</h4>
                  <Link href="/applications" className="text-xs font-semibold text-blue-600 hover:underline">
                    View all applications $\to$
                  </Link>
                </div>
                <div className="mt-3 space-y-2.5">
                  {data.recentApplications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">You haven't submitted any job applications yet.</p>
                  ) : (
                    data.recentApplications.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-xs shadow-sm">
                            {app.job.company.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{app.job.title}</p>
                            <p className="text-[11px] text-slate-500">{app.job.company.name} • ₹{app.job.ctcLPA} LPA</p>
                          </div>
                        </div>
                        <Badge variant="blue" size="sm">
                          {app.currentStage}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLACEMENT OFFICER / ADMIN / COORDINATOR / MANAGEMENT VIEW */}
      {currentUser.role !== "STUDENT" && currentUser.role !== "RECRUITER" && data && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Institutional Placement Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Academic Year 2026-2027 • Real-time database metrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/reports">
                <Button variant="outline" size="sm" className="text-xs">
                  Export Reports
                </Button>
              </Link>
              <Link href="/drives">
                <Button variant="primary" size="sm" className="text-xs">
                  View Placement Drives
                </Button>
              </Link>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{data.stats.totalStudents}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{data.stats.verifiedStudents} Verified</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Placed Count</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{data.stats.placedStudents}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{data.stats.placementPercentage}% Placement</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Highest CTC</p>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">₹{data.stats.highestCTC}L</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Super Dream band</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average CTC</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">₹{data.stats.averageCTC}L</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Median: ₹{data.stats.medianCTC} LPA</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recruiters</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{data.stats.totalCompanies}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{data.stats.totalJobs} Active Openings</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Offers Rolled</p>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{data.stats.totalOffers}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{data.stats.acceptedOffers} Accepted</p>
            </div>
          </div>

          {/* Department Breakdown & Funnel Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Comparison Chart */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Department Placement Performance</h3>
                  <p className="text-xs text-slate-500">Placed percentage & average package by engineering branch</p>
                </div>
              </div>
              <div className="mt-4">
                <DepartmentPlacementChart stats={data.departmentStats} />
              </div>
            </div>

            {/* Recruitment Pipeline Funnel */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Campus Recruitment Funnel</h3>
                  <p className="text-xs text-slate-500">Live candidate conversion across all hiring stages</p>
                </div>
                <Link href="/applications" className="text-xs font-semibold text-blue-600 hover:underline">
                  Kanban View $\to$
                </Link>
              </div>
              <div className="mt-4">
                <RecruitmentFunnelChart stats={data.funnelStats} />
              </div>
            </div>
          </div>

          {/* Recent Offers & Upcoming Drives */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Offers */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Recent Placement Offers</h3>
                <Link href="/offers" className="text-xs font-semibold text-blue-600 hover:underline">
                  View All Offers
                </Link>
              </div>
              <div className="mt-3 space-y-2.5">
                {data.recentOffers.map((off: any) => (
                  <div key={off.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={off.student.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${off.student.user.name}`}
                        alt={off.student.user.name}
                        className="w-8 h-8 rounded-full bg-white object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{off.student.user.name}</p>
                        <p className="text-[11px] text-slate-500">{off.company.name} • {off.job.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₹{off.ctcLPA} LPA</p>
                      <Badge variant={off.status === "ACCEPTED" ? "success" : "blue"} size="sm">
                        {off.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Drives */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upcoming Placement Drives</h3>
                <Link href="/drives" className="text-xs font-semibold text-blue-600 hover:underline">
                  Schedule Drive
                </Link>
              </div>
              <div className="mt-3 space-y-2.5">
                {data.upcomingDrives.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.title}</p>
                      <p className="text-[11px] text-slate-500">{d.company.name} • {d.venue}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{new Date(d.driveDate).toLocaleDateString()}</p>
                      <Badge variant="purple" size="sm">
                        {d.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RECRUITER VIEW */}
      {currentUser.role === "RECRUITER" && data && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white p-2 flex items-center justify-center">
                  <img src={data.company.logoUrl} alt={data.company.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{data.company.name} Recruiter Portal</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{data.company.industry} • {data.company.tier}</p>
                </div>
              </div>
              <Link href="/jobs/new">
                <Button variant="primary" size="sm" className="font-bold">
                  Post New Job Opening
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Jobs</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">{data.stats.activeJobs}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applicants</p>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{data.stats.totalApplicants}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shortlisted Candidates</p>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">{data.stats.shortlistedCount}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offers Accepted</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{data.stats.acceptedOffersCount}</p>
            </div>
          </div>

          {/* Recruiter Active Jobs */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Active Campus Openings</h3>
              <Link href="/applications" className="text-xs font-semibold text-blue-600 hover:underline">
                Review Candidate Pipeline $\to$
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {data.jobs.map((j: any) => (
                <div key={j.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{j.title}</p>
                    <p className="text-xs text-slate-500">₹{j.ctcLPA} LPA • {j.workMode} • {j.vacancies} Vacancies • {j.applications.length} Applicants</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={j.status === "PUBLISHED" ? "success" : "secondary"}>
                      {j.status}
                    </Badge>
                    <Link href={`/jobs/${j.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Applicants
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
