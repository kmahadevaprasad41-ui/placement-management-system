"use client";

import * as React from "react";
import { Sparkles, Award, TrendingUp, Building2, CheckCircle2, Zap } from "lucide-react";

export function PlacementMarquee() {
  const items = [
    { icon: Award, text: "Aarav Sharma (CSE) accepted Google SWE at ₹32.5 LPA", tag: "Super Dream", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900" },
    { icon: Zap, text: "Diya Patel (IT) accepted Microsoft IDC at ₹28.0 LPA", tag: "Dream Offer", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900" },
    { icon: Building2, text: "Amazon AWS Campus Drive Live — 8 Openings (₹26.5 LPA)", tag: "Active Drive", color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900" },
    { icon: TrendingUp, text: "Goldman Sachs Analyst Selection Round in Progress", tag: "Live Round", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900" },
    { icon: CheckCircle2, text: "100% Student Academic Profile Verifications Completed for Batch 2026-27", tag: "Milestone", color: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-900" },
    { icon: Sparkles, text: "Adobe Systems Member of Technical Staff Drive Announced", tag: "Upcoming", color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900" },
  ];

  return (
    <div className="relative w-full overflow-hidden py-3 bg-slate-900 text-white border-y border-slate-800 shadow-inner">
      {/* Left/Right Fading Edge Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-6">
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 shadow-sm text-xs font-semibold text-slate-200 whitespace-nowrap hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="p-1 rounded-full bg-blue-500/20 text-blue-400">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{item.text}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.color}`}>
                {item.tag}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
