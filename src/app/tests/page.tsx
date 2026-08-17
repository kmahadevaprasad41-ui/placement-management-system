"use client";

import * as React from "react";
import { ClipboardList, Plus, Users, Calendar, Award, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionUser } from "@/types";

export default function TestsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [tests, setTests] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/tests");
      if (res.ok) {
        const json = await res.json();
        setTests(json.tests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTests();
  }, []);

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Assessments & Coding Tests
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Recorded scores, platform integrations (HackerRank/Mettle), and candidate percentiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{t.title}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{t.job.company.name} • {t.job.title}</p>
                  </div>
                  <Badge variant="blue" size="sm">{t.platform}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{t.durationMinutes} mins</p>
                    <p className="text-[10px] text-slate-400">Duration</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{t.maxMarks} pts</p>
                    <p className="text-[10px] text-slate-400">Max Score</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{t.results.length}</p>
                    <p className="text-[10px] text-slate-400">Attended</p>
                  </div>
                </div>

                {t.instructions && (
                  <p className="text-xs text-slate-500 mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800">
                    {t.instructions}
                  </p>
                )}

                {/* Scorecards */}
                {t.results.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase text-slate-400">Top Candidate Scores</p>
                    {t.results.slice(0, 3).map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="font-semibold">{r.student.user.name} ({r.student.department.code})</span>
                        <span className="font-bold text-emerald-600">{r.score} / {t.maxMarks} pts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
