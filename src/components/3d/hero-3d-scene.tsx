"use client";

import * as React from "react";
import { Sparkles, Award, ShieldCheck, TrendingUp, Users, Building2, Layers, Zap } from "lucide-react";

export function Hero3DScene() {
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = React.useState({ x: 50, y: 50 });

  React.useEffect(() => {
    const handlePointer = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      const y = (e.clientY / window.innerHeight - 0.5) * 35;
      setMouseOffset({ x, y });

      const gx = (e.clientX / window.innerWidth) * 100;
      const gy = (e.clientY / window.innerHeight) * 100;
      setGlarePosition({ x: gx, y: gy });
    };

    window.addEventListener("mousemove", handlePointer);
    return () => window.removeEventListener("mousemove", handlePointer);
  }, []);

  return (
    <div className="relative w-full py-8 flex items-center justify-center overflow-hidden">
      {/* 3D Orbiting Glow Ambient Spheres */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * -0.7}px, ${mouseOffset.y * -0.7}px, 0)`,
          transition: "transform 0.2s ease-out",
        }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-blue-500/25 via-indigo-500/20 to-purple-500/25 blur-3xl -top-12 -left-12 animate-pulse-glow"
      />
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.9}px, ${mouseOffset.y * 0.9}px, 0)`,
          transition: "transform 0.2s ease-out",
        }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-blue-500/20 blur-3xl -bottom-12 -right-12 animate-pulse-glow"
      />

      {/* 3D Floating Isometric Preview Stage */}
      <div
        style={{
          transform: `perspective(1200px) rotateX(${10 - mouseOffset.y * 0.35}deg) rotateY(${
            mouseOffset.x * 0.45
          }deg) translateZ(20px)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out",
        }}
        className="relative max-w-4xl w-full mx-auto p-6 sm:p-8 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border-2 border-white/80 dark:border-slate-700/80 shadow-[0_35px_80px_-15px_rgba(37,99,235,0.3)]"
      >
        {/* Holographic Specular Glare Sheen */}
        <div
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
          }}
          className="absolute inset-0 rounded-3xl pointer-events-none z-20"
        />

        {/* Floating 3D Badge 1: Highest Offer */}
        <div
          style={{
            transform: "translateZ(65px)",
            transition: "transform 0.2s ease-out",
          }}
          className="absolute -top-7 -left-3 sm:-left-6 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-purple-300 dark:border-purple-800 shadow-2xl flex items-center gap-3 animate-float-slow z-30 card-3d-lift"
        >
          <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 shadow-md">
            <Award className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Peak Campus CTC</p>
            <p className="text-sm sm:text-base font-black text-purple-600 dark:text-purple-400">₹32.5 LPA (Google)</p>
          </div>
        </div>

        {/* Floating 3D Badge 2: Verified Students */}
        <div
          style={{
            transform: "translateZ(75px)",
            transition: "transform 0.2s ease-out",
          }}
          className="absolute -bottom-7 -right-3 sm:-right-6 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-emerald-300 dark:border-emerald-800 shadow-2xl flex items-center gap-3 animate-float-reverse z-30 card-3d-lift"
        >
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 shadow-md">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Verification Engine</p>
            <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">100% Audit Verified</p>
          </div>
        </div>

        {/* Central 3D Interactive Pipeline Visualizer */}
        <div className="space-y-4" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="ml-2 text-xs font-mono font-bold text-slate-500">Live Campus Hiring Console</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>2026-27 Batch Live</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-200/80 dark:border-slate-700 shadow-sm card-3d-lift">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Placed Students</p>
              <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">52 / 52 Active</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Across 5 Departments</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-purple-200/80 dark:border-slate-700 shadow-sm card-3d-lift">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Empaneled Partners</p>
              <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">8 Tier-1/2</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Google, Microsoft, Amazon</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-emerald-200/80 dark:border-slate-700 shadow-sm card-3d-lift">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average CTC</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹20.4 LPA</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Median: ₹18.0 LPA</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-amber-200/80 dark:border-slate-700 shadow-sm card-3d-lift">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Offer Conversion</p>
              <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">100% Rate</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Zero Double-Booking</p>
            </div>
          </div>

          {/* 3D Interactive Pipeline Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
              <span>Recruitment Lifecycle Progression</span>
              <span className="text-blue-600 font-extrabold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>8-Stage Automated Flow</span>
              </span>
            </div>
            <div className="grid grid-cols-8 gap-1.5 text-[10px] font-bold text-center">
              {["Applied", "Shortlist", "Test", "Interview", "Selected", "Offered", "Accepted", "Joined"].map(
                (stage, idx) => (
                  <div
                    key={stage}
                    className={`py-2 px-1 rounded-xl border transition-all duration-200 hover:scale-105 cursor-default ${
                      idx < 6
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
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
