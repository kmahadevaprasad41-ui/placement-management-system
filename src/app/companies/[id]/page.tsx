"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2, ExternalLink, MapPin, Briefcase, CalendarDays, Award, Users, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionUser } from "@/types";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [company, setCompany] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch(`/api/companies/${companyId}`);
      if (res.ok) {
        const json = await res.json();
        setCompany(json.company);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCompany();
  }, [companyId]);

  if (isLoading || !company || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Company Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2.5 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="font-extrabold text-xl">{company.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{company.name}</h2>
                  <Badge variant={company.tier === "TIER_1" ? "purple" : "blue"} size="sm">
                    {company.tier === "TIER_1" ? "Super Dream Tier" : company.tier === "TIER_2" ? "Dream Tier" : "Mass Tier"}
                  </Badge>
                  <Badge variant="success" size="sm">
                    {company.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {company.industry} • {company.hqAddress || "Global Headquarters"}
                </p>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <span>Visit Career Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed max-w-4xl">
            {company.description}
          </p>
        </div>

        {/* Company Jobs & Drives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                Job Openings at {company.name} ({company.jobs.length})
              </h3>
              <div className="space-y-3">
                {company.jobs.map((j: any) => (
                  <div key={j.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{j.title}</p>
                      <p className="text-xs text-slate-500">{j.role} • {j.workMode} • ₹{j.ctcLPA} LPA</p>
                    </div>
                    <Link href={`/jobs/${j.id}`}>
                      <Button variant="primary" size="sm" className="text-xs">
                        View Role $\to$
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recruiters Contact Card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                Talent Acquisition Contacts
              </h3>
              <div className="mt-3 space-y-3">
                {company.recruiters.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <img
                      src={r.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${r.user.name}`}
                      alt={r.user.name}
                      className="w-9 h-9 rounded-full bg-slate-100 object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{r.user.name}</p>
                      <p className="text-[11px] text-slate-500">{r.designation || "Recruiter"}</p>
                      <p className="text-[10px] text-blue-600 font-mono mt-0.5">{r.user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
