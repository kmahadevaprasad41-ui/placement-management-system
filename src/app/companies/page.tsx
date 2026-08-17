"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Plus, ExternalLink, ShieldCheck, MapPin, Briefcase, Award } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function CompaniesPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("IT & Cloud Services");
  const [tier, setTier] = React.useState("TIER_1");
  const [hqAddress, setHqAddress] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/companies");
      if (res.ok) {
        const json = await res.json();
        setCompanies(json.companies);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industry,
          tier,
          hqAddress,
          website,
          description,
        }),
      });

      if (res.ok) {
        toast.success("Company Added", `${name} has been added to the placement roster.`);
        setIsAddOpen(false);
        setName("");
        setHqAddress("");
        setWebsite("");
        setDescription("");
        fetchCompanies();
      }
    } catch (e) {
      toast.error("Failed to create company");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const canAdd = ["PLACEMENT_OFFICER", "SUPER_ADMIN"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Corporate Recruitment Partners
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empaneled companies, placement tiers, active openings, and recruiter points of contact.
            </p>
          </div>
          {canAdd && (
            <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Register Company
            </Button>
          )}
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="font-extrabold text-sm">{c.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{c.industry}</p>
                    </div>
                  </div>

                  <Badge
                    variant={c.tier === "TIER_1" ? "purple" : c.tier === "TIER_2" ? "blue" : "secondary"}
                    size="sm"
                  >
                    {c.tier === "TIER_1" ? "Super Dream" : c.tier === "TIER_2" ? "Dream" : "Mass Tier"}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                  {c.description || "Partner company actively hiring students across engineering and management disciplines."}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{c.jobs.length}</p>
                    <p className="text-[10px] text-slate-400">Openings</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{c.offers.length}</p>
                    <p className="text-[10px] text-slate-400">Offers</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {c.offers.length > 0 ? `₹${Math.max(...c.offers.map((o: any) => o.ctcLPA))}L` : "N/A"}
                    </p>
                    <p className="text-[10px] text-slate-400">Max CTC</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {c.website ? (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span />
                )}

                <Link href={`/companies/${c.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Profile $\to$
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Add Company Modal */}
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Register Recruitment Partner"
          description="Add a new empaneled company for campus hiring drives."
        >
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cisco Systems, Intel, Uber"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Software, Core, FinTech"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Placement Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                >
                  <option value="TIER_1">Tier 1 (Super Dream $\ge$ 14 LPA)</option>
                  <option value="TIER_2">Tier 2 (Dream 8 - 14 LPA)</option>
                  <option value="TIER_3">Tier 3 (Mass / Regular $\le$ 8 LPA)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Careers / Corporate Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com/careers"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                About the Company
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of tech stack, domains, and global operations..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Save Partner
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
