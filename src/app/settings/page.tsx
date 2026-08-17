"use client";

import * as React from "react";
import { Settings, ShieldCheck, Building2, Save } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [settings, setSettings] = React.useState<any | null>(null);
  const [policy, setPolicy] = React.useState<any | null>(null);
  const [departments, setDepartments] = React.useState<any[]>([]);

  const [institutionName, setInstitutionName] = React.useState("");
  const [currentAcademicYear, setCurrentAcademicYear] = React.useState("");
  const [allowMultipleOffers, setAllowMultipleOffers] = React.useState(true);
  const [stopAfterAcceptedOffer, setStopAfterAcceptedOffer] = React.useState(true);
  const [minMultiplier, setMinMultiplier] = React.useState("1.5");
  const [minAbsoluteCtc, setMinAbsoluteCtc] = React.useState("14.0");
  const [maxOffersAllowed, setMaxOffersAllowed] = React.useState("2");

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const toast = useToast();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/settings");
      if (res.ok) {
        const json = await res.json();
        setSettings(json.settings);
        setPolicy(json.policy);
        setDepartments(json.departments || []);

        if (json.settings) {
          setInstitutionName(json.settings.institutionName);
          setCurrentAcademicYear(json.settings.currentAcademicYear);
        }
        if (json.policy) {
          setAllowMultipleOffers(json.policy.allowMultipleOffers);
          setStopAfterAcceptedOffer(json.policy.stopAfterAcceptedOffer);
          setMinMultiplier(String(json.policy.minCtcMultiplierForSecondOffer));
          setMinAbsoluteCtc(String(json.policy.minAbsoluteCtcForSecondOffer));
          setMaxOffersAllowed(String(json.policy.maxOffersAllowed));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName,
          currentAcademicYear,
          allowMultipleOffers,
          stopAfterAcceptedOffer,
          minCtcMultiplierForSecondOffer: minMultiplier,
          minAbsoluteCtcForSecondOffer: minAbsoluteCtc,
          maxOffersAllowed,
        }),
      });

      if (res.ok) {
        toast.success("Settings Saved", "Institutional rules and policies updated successfully.");
        fetchSettings();
      }
    } catch (e) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <AppShell user={currentUser}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Institution Settings & Placement Policy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure placement policies, dream job multipliers, and academic department structures.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Institutional Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">1. Institution Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Academic Year
                </label>
                <input
                  type="text"
                  value={currentAcademicYear}
                  onChange={(e) => setCurrentAcademicYear(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Multiple Offer Policy Engine */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">2. Placement Policy & Dream Offer Engine</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  id="multi"
                  checked={allowMultipleOffers}
                  onChange={(e) => setAllowMultipleOffers(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="multi" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Allow Multiple Offers (with Dream Policy)
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  id="stop"
                  checked={stopAfterAcceptedOffer}
                  onChange={(e) => setStopAfterAcceptedOffer(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="stop" className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Stop Further Applications Once Offer is Accepted
                </label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  2nd Offer CTC Multiplier
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={minMultiplier}
                  onChange={(e) => setMinMultiplier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">e.g. 1.5x of 1st Offer</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Super Dream Min CTC (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={minAbsoluteCtc}
                  onChange={(e) => setMinAbsoluteCtc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">e.g. ₹14.0 LPA threshold</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Max Allowed Offers
                </label>
                <input
                  type="number"
                  value={maxOffersAllowed}
                  onChange={(e) => setMaxOffersAllowed(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">Cap per student</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="gap-2">
              <Save className="w-4 h-4" /> Save Institutional Settings
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
