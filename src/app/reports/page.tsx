"use client";

import * as React from "react";
import { FileSpreadsheet, Download, Filter, Search, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionUser } from "@/types";

export default function ReportsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [reportType, setReportType] = React.useState("placed_students");
  const [department, setDepartment] = React.useState("");
  const [reportData, setReportData] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const params = new URLSearchParams();
      if (reportType) params.set("type", reportType);
      if (department) params.set("department", department);

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setReportData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReport();
  }, [reportType, department]);

  const handleExportCSV = () => {
    if (!reportData || !reportData.rows || reportData.rows.length === 0) return;
    const headers = Object.keys(reportData.rows[0]);
    const csvRows = [
      headers.join(","),
      ...reportData.rows.map((row: any) =>
        headers.map((h) => `"${row[h] !== undefined ? row[h] : ""}"`).join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PMS_Report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const columns = reportData?.rows?.length > 0 ? Object.keys(reportData.rows[0]) : [];

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Institutional Reports Studio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Custom compliance exports for accreditation (NAAC/NBA), management, and departments.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            disabled={!reportData?.rows?.length}
            className="text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Spreadsheet (CSV)
          </Button>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">Report Template:</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold bg-white dark:bg-slate-800"
            >
              <option value="placed_students">Placed Students & Offers Roster</option>
              <option value="company_offers">Corporate Offers & Salary Packages</option>
              <option value="all_candidates">All Graduating Candidates Overview</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">Department:</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold bg-white dark:bg-slate-800"
            >
              <option value="">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="EE">EE</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-semibold sm:ml-auto">
            {reportData?.total || 0} Records generated
          </span>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {reportData?.rows?.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No matching records for the selected report filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="py-3 px-4 capitalize">
                        {col.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reportData.rows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      {columns.map((col) => (
                        <td key={col} className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : "-"}
                        </td>
                      ))}
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
