"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SessionUser } from "@/types";
import {
  TrendingUp,
  DollarSign,
  Calculator,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Award,
  Layers,
  ArrowRight,
  Info,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";

export default function SalaryInsightsPage() {
  const [currentUser] = React.useState<SessionUser>({
    id: "demo_user",
    email: "student.aarav@institution.edu",
    name: "Aarav Sharma",
    role: "STUDENT",
  });

  const [ctcLPA, setCtcLPA] = React.useState<number>(32.5);

  // Financial calculations
  const annualCTC = ctcLPA * 100000;
  const baseSalaryAnnual = Math.round(annualCTC * 0.65);
  const variableBonusAnnual = Math.round(annualCTC * 0.15);
  const stockEquityAnnual = Math.round(annualCTC * 0.12);
  const retiralPFAnnual = Math.round(annualCTC * 0.08);

  // Monthly deductions
  const baseMonthlyGross = Math.round(baseSalaryAnnual / 12);
  const monthlyEPF = Math.round(Math.min(baseMonthlyGross * 0.12, 21600 / 12 * 10));
  const monthlyProfTax = 200;

  // New Tax Regime Approximate Tax
  let annualTax = 0;
  if (baseSalaryAnnual > 1500000) {
    annualTax = Math.round(150000 + (baseSalaryAnnual - 1500000) * 0.3);
  } else if (baseSalaryAnnual > 1200000) {
    annualTax = Math.round(90000 + (baseSalaryAnnual - 1200000) * 0.2);
  } else if (baseSalaryAnnual > 900000) {
    annualTax = Math.round(45000 + (baseSalaryAnnual - 900000) * 0.15);
  } else if (baseSalaryAnnual > 600000) {
    annualTax = Math.round(15000 + (baseSalaryAnnual - 600000) * 0.1);
  } else if (baseSalaryAnnual > 300000) {
    annualTax = Math.round((baseSalaryAnnual - 300000) * 0.05);
  }

  const monthlyTax = Math.round(annualTax / 12);
  const estimatedMonthlyInHand = Math.max(0, baseMonthlyGross - monthlyEPF - monthlyProfTax - monthlyTax);

  const presetPackages = [
    { label: "Google SWE", lpa: 32.5, tier: "SUPER_DREAM" },
    { label: "Microsoft Azure", lpa: 28.0, tier: "SUPER_DREAM" },
    { label: "Amazon AWS", lpa: 26.5, tier: "SUPER_DREAM" },
    { label: "Bosch Mobility", lpa: 12.0, tier: "DREAM" },
    { label: "Infosys SES", lpa: 9.5, tier: "CORE" },
    { label: "LTTS Embedded", lpa: 8.5, tier: "CORE" },
  ];

  return (
    <AppShell user={currentUser}>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Calculator className="w-3.5 h-3.5 text-emerald-300" />
              <span>Campus Compensation Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Interactive CTC & In-Hand Take-Home Calculator
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
              Demystify campus offer letters. Calculate your real monthly take-home salary, understand base vs variable splits, stock vesting schedules, and provident fund tax deductions.
            </p>
          </div>
        </div>

        {/* Quick Offer Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2">Quick Package Presets:</span>
          {presetPackages.map((p) => (
            <button
              key={p.label}
              onClick={() => setCtcLPA(p.lpa)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                ctcLPA === p.lpa
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {p.label} (₹{p.lpa} LPA)
            </button>
          ))}
        </div>

        {/* Interactive Slider & In-Hand Highlights Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calculation Controls */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Annual Cost to Company (CTC)
                </h3>
                <p className="text-xs text-slate-500">Adjust the slider to simulate any campus offer package</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-right">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{ctcLPA.toFixed(1)} LPA
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="3.0"
                max="50.0"
                step="0.5"
                value={ctcLPA}
                onChange={(e) => setCtcLPA(parseFloat(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:bg-slate-700"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>₹3.0 LPA (Mass Recruiters)</span>
                <span>₹15.0 LPA (Dream)</span>
                <span>₹30.0 LPA (Super Dream)</span>
                <span>₹50.0 LPA (Elite Product)</span>
              </div>
            </div>

            {/* CTC Component Breakdown Bar */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                CTC Salary Component Breakdown
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                  <p className="text-slate-500 text-[11px]">Base Salary (65%)</p>
                  <p className="font-extrabold text-blue-600 text-sm">₹{(baseSalaryAnnual / 100000).toFixed(2)} LPA</p>
                  <p className="text-[10px] text-slate-400">Fixed Monthly Component</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                  <p className="text-slate-500 text-[11px]">Performance Bonus</p>
                  <p className="font-extrabold text-purple-600 text-sm">₹{(variableBonusAnnual / 100000).toFixed(2)} LPA</p>
                  <p className="text-[10px] text-slate-400">Annual Appraisal Payout</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <p className="text-slate-500 text-[11px]">Stock / RSUs (12%)</p>
                  <p className="font-extrabold text-amber-600 text-sm">₹{(stockEquityAnnual / 100000).toFixed(2)} LPA</p>
                  <p className="text-[10px] text-slate-400">Vested over 4 years</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 text-[11px]">EPF & Retirals (8%)</p>
                  <p className="font-extrabold text-slate-700 dark:text-slate-300 text-sm">₹{(retiralPFAnnual / 100000).toFixed(2)} LPA</p>
                  <p className="text-[10px] text-slate-400">Statutory Benefits</p>
                </div>
              </div>
            </div>
          </div>

          {/* In-Hand Monthly Take-Home Card */}
          <TiltCard className="p-6 sm:p-8 flex flex-col justify-between border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 dark:bg-slate-900">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Estimated Monthly In-Hand
                </span>
                <Badge variant="emerald" size="sm">Net Take-Home</Badge>
              </div>

              <div className="my-4">
                <p className="text-4xl font-black text-slate-900 dark:text-white">
                  ₹{estimatedMonthlyInHand.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Deposited into your bank account each month</p>
              </div>

              {/* Deductions breakdown */}
              <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Monthly Base Gross:</span>
                  <span className="font-bold">₹{baseMonthlyGross.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Estimated Income Tax (TDS):</span>
                  <span>- ₹{monthlyTax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Employee PF (12%):</span>
                  <span>- ₹{monthlyEPF.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Professional Tax:</span>
                  <span>- ₹{monthlyProfTax}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                * Note: Estimates are calculated based on standard Indian FY 2026-27 New Tax Regime slabs without variable bonus payout.
              </p>
            </div>
          </TiltCard>
        </div>

        {/* Campus Placement Policy Thresholds Matrix */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Institutional Placement Category Tiers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 dark:bg-purple-950/20 dark:border-purple-900 space-y-2">
              <Badge variant="purple" size="sm">Super Dream Tier</Badge>
              <p className="text-lg font-black text-purple-900 dark:text-purple-200">≥ ₹20.0 LPA</p>
              <p className="text-slate-600 dark:text-slate-300">Google, Microsoft, Amazon, Goldman Sachs, Adobe. Multi-offer eligibility open.</p>
            </div>

            <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900 space-y-2">
              <Badge variant="blue" size="sm">Dream Tier</Badge>
              <p className="text-lg font-black text-blue-900 dark:text-blue-200">₹10.0 - ₹20.0 LPA</p>
              <p className="text-slate-600 dark:text-slate-300">Bosch Global, LTTS, Cisco, Oracle, Morgan Stanley.</p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 space-y-2">
              <Badge variant="secondary" size="sm">Core & Digital Tier</Badge>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">₹5.0 - ₹10.0 LPA</p>
              <p className="text-slate-600 dark:text-slate-300">Infosys Specialist, TCS Digital, Wipro Turbo, Accenture.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
