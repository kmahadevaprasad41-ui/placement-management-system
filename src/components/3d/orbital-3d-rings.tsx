"use client";

import * as React from "react";
import { Award, Sparkles, Building2, Star, CheckCircle, Zap } from "lucide-react";

export function Orbital3DRings() {
  const companies = [
    { name: "Google", ctc: "32.5 LPA", color: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10 text-blue-600 border-blue-200" },
    { name: "Microsoft", ctc: "28.0 LPA", color: "from-cyan-500 to-blue-600", bg: "bg-cyan-500/10 text-cyan-600 border-cyan-200" },
    { name: "Amazon", ctc: "26.5 LPA", color: "from-amber-500 to-orange-600", bg: "bg-amber-500/10 text-amber-600 border-amber-200" },
    { name: "Adobe", ctc: "25.0 LPA", color: "from-rose-500 to-pink-600", bg: "bg-rose-500/10 text-rose-600 border-rose-200" },
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto py-8 flex items-center justify-center">
      {/* Outer 3D Gyro Ring */}
      <div className="absolute w-72 h-72 rounded-full border border-dashed border-blue-400/30 animate-spin-slow pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full border border-purple-400/20 animate-spin-reverse pointer-events-none" />

      {/* Central 3D Floating Trophy/Core Card */}
      <div className="relative z-10 p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-3 animate-float-slow">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 border-t border-amber-200">
          <Award className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <Sparkles className="w-3 h-3 text-amber-500" /> Tier-1 Campus Placement
          </span>
          <h4 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
            Dream Career Opportunities
          </h4>
          <p className="text-xs text-slate-500">Live Campus Drive Offers</p>
        </div>
      </div>

      {/* Orbiting Satellite Cards */}
      <div className="absolute -top-3 left-4 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 shadow-lg flex items-center gap-2 animate-float-reverse text-xs">
        <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-extrabold text-[11px]">
          G
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">Google</p>
          <p className="text-[10px] font-extrabold text-emerald-600">₹32.5L CTC</p>
        </div>
      </div>

      <div className="absolute -bottom-3 left-6 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 shadow-lg flex items-center gap-2 animate-float-slow text-xs">
        <div className="w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 font-extrabold text-[11px]">
          M
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">Microsoft</p>
          <p className="text-[10px] font-extrabold text-purple-600">₹28.0L CTC</p>
        </div>
      </div>

      <div className="absolute top-8 -right-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-lg flex items-center gap-2 animate-float-reverse text-xs">
        <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 font-extrabold text-[11px]">
          A
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">Amazon</p>
          <p className="text-[10px] font-extrabold text-amber-600">₹26.5L CTC</p>
        </div>
      </div>
    </div>
  );
}
