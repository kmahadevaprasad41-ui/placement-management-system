"use client";

import * as React from "react";
import Link from "next/link";
import { Users, Search, Filter, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Download, GraduationCap } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionUser } from "@/types";

export default function StudentsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [students, setStudents] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [placementStatus, setPlacementStatus] = React.useState("");
  const [minCGPA, setMinCGPA] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (department) params.set("department", department);
      if (placementStatus) params.set("status", placementStatus);
      if (minCGPA) params.set("minCGPA", minCGPA);

      const res = await fetch(`/api/students?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setStudents(json.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, [department, placementStatus, minCGPA]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const exportCSV = () => {
    if (students.length === 0) return;
    const headers = ["Roll Number", "Name", "Email", "Department", "CGPA", "Active Backlogs", "Verified", "Placement Status"];
    const rows = students.map((s) => [
      s.rollNumber,
      `"${s.user.name}"`,
      s.user.email,
      s.department.code,
      s.academicRecord?.cgpa || 0,
      s.academicRecord?.activeBacklogs || 0,
      s.isVerified ? "YES" : "NO",
      s.placementStatus,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_Roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Student Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified campus profiles, academic standings, and placement statuses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <Button type="submit" variant="primary" size="sm" className="text-xs">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-semibold uppercase">Department:</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
              >
                <option value="">All Departments</option>
                <option value="CSE">CSE (Computer Science)</option>
                <option value="IT">IT (Information Tech)</option>
                <option value="ECE">ECE (Electronics)</option>
                <option value="ME">ME (Mechanical)</option>
                <option value="EE">EE (Electrical)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-semibold uppercase">Status:</span>
              <select
                value={placementStatus}
                onChange={(e) => setPlacementStatus(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
              >
                <option value="">All Statuses</option>
                <option value="UNPLACED">Unplaced</option>
                <option value="IN_PROCESS">In Process</option>
                <option value="PLACED">Placed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-semibold uppercase">Min CGPA:</span>
              <select
                value={minCGPA}
                onChange={(e) => setMinCGPA(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-xs font-medium"
              >
                <option value="">Any CGPA</option>
                <option value="8.0">$\ge$ 8.0 CGPA</option>
                <option value="7.5">$\ge$ 7.5 CGPA</option>
                <option value="7.0">$\ge$ 7.0 CGPA</option>
                <option value="6.0">$\ge$ 6.0 CGPA</option>
              </select>
            </div>

            <span className="text-slate-400 text-[11px] ml-auto font-semibold">
              Showing {students.length} students
            </span>
          </div>
        </div>

        {/* Student Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : students.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No students match the current filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">CGPA</th>
                    <th className="py-3 px-4">Backlogs</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4">Placement</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${s.user.name}`}
                            alt={s.user.name}
                            className="w-8 h-8 rounded-full bg-slate-100 object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{s.user.name}</p>
                            <p className="text-[11px] text-slate-500">{s.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {s.rollNumber}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" size="sm">
                          {s.department.code}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {s.academicRecord?.cgpa ? s.academicRecord.cgpa.toFixed(2) : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {s.academicRecord?.activeBacklogs === 0 ? (
                          <span className="text-emerald-600 font-semibold">0 Active</span>
                        ) : (
                          <span className="text-rose-600 font-bold">{s.academicRecord?.activeBacklogs} Active</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {s.isVerified ? (
                          <Badge variant="success" size="sm" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            s.placementStatus === "PLACED"
                              ? "success"
                              : s.placementStatus === "IN_PROCESS"
                              ? "blue"
                              : "secondary"
                          }
                          size="sm"
                        >
                          {s.placementStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/students/${s.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700">
                            Profile $\to$
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
