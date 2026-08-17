"use client";

import * as React from "react";
import { Award, CheckCircle2, XCircle, FileText, Download, Plus, AlertCircle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function OffersPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [offers, setOffers] = React.useState<any[]>([]);
  const [policy, setPolicy] = React.useState<any | null>(null);
  const [selections, setSelections] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Issue Offer Modal state
  const [isIssueOpen, setIsIssueOpen] = React.useState(false);
  const [selectedStudentId, setSelectedStudentId] = React.useState("");
  const [selectedJobId, setSelectedJobId] = React.useState("");
  const [ctcLPA, setCtcLPA] = React.useState("18.0");
  const [baseSalary, setBaseSalary] = React.useState("14.0");
  const [variableSalary, setVariableSalary] = React.useState("4.0");
  const [joiningDate, setJoiningDate] = React.useState("2027-07-01");
  const [isIssuing, setIsIssuing] = React.useState(false);

  // Student Respond Modal state
  const [respondOffer, setRespondOffer] = React.useState<any | null>(null);
  const [respondAction, setRespondAction] = React.useState<"ACCEPT" | "REJECT">("ACCEPT");
  const [respondRemarks, setRespondRemarks] = React.useState("");
  const [isResponding, setIsResponding] = React.useState(false);

  const toast = useToast();

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const [offRes, selRes] = await Promise.all([
        fetch("/api/offers"),
        fetch("/api/selections"),
      ]);

      if (offRes.ok) {
        const json = await offRes.json();
        setOffers(json.offers);
        setPolicy(json.policy);
      }
      if (selRes.ok) {
        const selJson = await selRes.json();
        setSelections(selJson.selections);
        if (selJson.selections.length > 0 && !selectedStudentId) {
          setSelectedStudentId(selJson.selections[0].studentId);
          setSelectedJobId(selJson.selections[0].jobId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOffers();
  }, []);

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          jobId: selectedJobId,
          ctcLPA,
          baseSalary,
          variableSalary,
          joiningDate,
        }),
      });

      if (res.ok) {
        toast.success("Offer Released! 🎉", "Official letter generated and student notified.");
        setIsIssueOpen(false);
        fetchOffers();
      } else {
        toast.error("Failed to release offer");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsIssuing(false);
    }
  };

  const handleRespondSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondOffer) return;
    setIsResponding(true);
    try {
      const res = await fetch(`/api/offers/${respondOffer.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: respondAction,
          remarks: respondRemarks,
        }),
      });

      if (res.ok) {
        toast.success(
          respondAction === "ACCEPT" ? "Offer Accepted! 🎓" : "Offer Declined",
          "Your response has been registered and institutional records updated."
        );
        setRespondOffer(null);
        fetchOffers();
      } else {
        const err = await res.json();
        toast.error("Response failed", err.error);
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsResponding(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const isStudent = currentUser.role === "STUDENT";
  const canIssue = ["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Placement Offers & Joining Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official compensation contracts, multiple-offer institutional policy compliance, and onboarding.
            </p>
          </div>

          {canIssue && (
            <Button variant="primary" size="sm" onClick={() => setIsIssueOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Release Offer Letter
            </Button>
          )}
        </div>

        {/* Policy Banner */}
        {policy && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">Active Placement Policy: {policy.name}</p>
                <p className="text-blue-700 dark:text-blue-300 text-[11px] mt-0.5">
                  Allows max {policy.maxOffersAllowed} offers per student • 2nd Dream offer requires $\ge$ {policy.minCtcMultiplierForSecondOffer}x current CTC or $\ge$ ₹{policy.minAbsoluteCtcForSecondOffer} LPA.
                </p>
              </div>
            </div>
            <Badge variant="blue" size="sm" className="shrink-0">
              Policy Enforced
            </Badge>
          </div>
        )}

        {/* Offers List */}
        <div className="space-y-4">
          {offers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
              No placement offers recorded.
            </div>
          ) : (
            offers.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 p-2.5 flex items-center justify-center text-emerald-600 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{o.company.name}</h3>
                      <Badge variant={o.status === "ACCEPTED" ? "success" : o.status === "REJECTED" ? "destructive" : "purple"} size="sm">
                        {o.status}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      {o.job.title} • Candidate: <span className="text-blue-600 font-bold">{o.student.user.name}</span> ({o.student.rollNumber} - {o.student.department.code})
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Letter: <strong className="font-mono text-slate-700 dark:text-slate-300">{o.offerLetterNumber}</strong></span>
                      <span>Joining Date: <strong>{o.joiningDate ? new Date(o.joiningDate).toLocaleDateString() : "TBD"}</strong></span>
                      {o.joiningRecord && (
                        <span className="text-emerald-600 font-bold">Joining Status: {o.joiningRecord.status}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                  <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{o.ctcLPA} LPA
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Student Accept/Reject Action */}
                    {isStudent && o.status === "ISSUED" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setRespondOffer(o)}
                        className="text-xs font-bold"
                      >
                        Accept / Decline Offer
                      </Button>
                    )}

                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Download className="w-3.5 h-3.5" /> Letter
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Release Offer Modal */}
        <Modal
          isOpen={isIssueOpen}
          onClose={() => setIsIssueOpen(false)}
          title="Release Official Offer Letter"
          description="Extend compensation offer to a selected candidate."
        >
          <form onSubmit={handleIssueSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Selected Candidate & Role
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  const sel = selections.find((s) => s.studentId === e.target.value);
                  setSelectedStudentId(e.target.value);
                  if (sel) setSelectedJobId(sel.jobId);
                }}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              >
                {selections.map((s) => (
                  <option key={s.id} value={s.studentId}>
                    {s.student.user.name} ({s.student.rollNumber}) — {s.job.company.name} ({s.job.title})
                  </option>
                ))}
              </select>
            </div>

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
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fixed Base (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
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
                  value={variableSalary}
                  onChange={(e) => setVariableSalary(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsIssueOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isIssuing}>
                Release Offer
              </Button>
            </div>
          </form>
        </Modal>

        {/* Student Respond Modal */}
        {respondOffer && (
          <Modal
            isOpen={Boolean(respondOffer)}
            onClose={() => setRespondOffer(null)}
            title={`Respond to ${respondOffer.company.name} Offer`}
            description={`Package: ₹${respondOffer.ctcLPA} LPA for ${respondOffer.job.title}`}
          >
            <form onSubmit={handleRespondSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Decision
                </label>
                <select
                  value={respondAction}
                  onChange={(e) => setRespondAction(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800 font-bold"
                >
                  <option value="ACCEPT">✓ Formally Accept Offer (Initiate Joining & Mark Placed)</option>
                  <option value="REJECT">✕ Decline / Reject Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Remarks / Acknowledgement Note
                </label>
                <textarea
                  rows={3}
                  value={respondRemarks}
                  onChange={(e) => setRespondRemarks(e.target.value)}
                  placeholder="e.g. I am thrilled to accept this role and look forward to joining the team."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setRespondOffer(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={respondAction === "ACCEPT" ? "success" : "destructive"}
                  size="sm"
                  isLoading={isResponding}
                >
                  Confirm Decision
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
