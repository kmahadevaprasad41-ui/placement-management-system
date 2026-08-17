"use client";

import * as React from "react";
import { Sparkles, Award, ShieldCheck, TrendingUp, Users, Building2 } from "lucide-react";

export function Hero3DScene() {
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handlePointer = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handlePointer);
    return () => window.removeEventListener("mousemove", handlePointer);
  }, []);

  return (
    <div className="relative w-full py-6 flex items-center justify-center overflow-hidden">
      {/* 3D Orbiting Glow Spheres */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px, 0)`,
          transition: "transform 0.2s ease-out",
        }}
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl -top-10 -left-10 animate-pulse-glow"
      />
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`,
          transition: "transform 0.2s ease-out",
        }}
        className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/15 to-blue-500/15 blur-3xl -bottom-10 -right-10 animate-pulse-glow"
      />

      {/* 3D Floating Isometric Preview Stage */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${12 - mouseOffset.y * 0.4}deg) rotateY(${
            mouseOffset.x * 0.5
          }deg) translateZ(10px)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out",
        }}
        className="relative max-w-4xl w-full mx-auto p-8 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-800/80 shadow-[0_30px_70px_-20px_rgba(37,99,235,0.25)]"
      >
        {/* Floating 3D Badge 1: Highest Offer */}
        <div
          style={{ transform: "translateZ(45px)" }}
          className="absolute -top-6 -left-4 sm:-left-6 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-3 animate-float-slow"
        >
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Peak Campus CTC</p>
            <p className="text-sm font-extrabold text-purple-600 dark:text-purple-400">₹32.5 LPA (Google)</p>
          </div>
        </div>

        {/* Floating 3D Badge 2: Verified Students */}
        <div
          style={{ transform: "translateZ(55px)" }}
          className="absolute -bottom-6 -right-4 sm:-right-6 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-3 animate-float-reverse"
        >
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Verification Rate</p>
            <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">100% Audit Verified</p>
          </div>
        </div>

        {/* Central 3D Interactive Pipeline Visualizer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono font-bold text-slate-500">Live Campus Hiring Console</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                ● 2026-27 Batch Live
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Placed Students</p>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">52 / 52 Active</p>
              <p className="text-[10px] text-slate-400 mt-1">Across 5 Departments</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-purple-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Empaneled Partners</p>
              <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">8 Tier-1/2</p>
              <p className="text-[10px] text-slate-400 mt-1">Google, Microsoft, Amazon</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-emerald-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Average CTC</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">₹20.4 LPA</p>
              <p className="text-[10px] text-slate-400 mt-1">Median: ₹18.0 LPA</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-100 dark:border-slate-700">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Offer Conversion</p>
              <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">100% Rate</p>
              <p className="text-[10px] text-slate-400 mt-1">Zero Double-Booking</p>
            </div>
          </div>

          {/* 3D Interactive Pipeline Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
              <span>Recruitment Lifecycle Progression</span>
              <span className="text-blue-600">8-Stage Automated Flow</span>
            </div>
            <div className="grid grid-cols-8 gap-1 text-[10px] font-bold text-center">
              {["Applied", "Shortlist", "Test", "Interview", "Selected", "Offered", "Accepted", "Joined"].map(
                (stage, idx) => (
                  <div
                    key={stage}
                    className={`py-1.5 px-1 rounded-lg border transition-all duration-200 hover:scale-105 cursor-default ${
                      idx < 6
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {stage}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
