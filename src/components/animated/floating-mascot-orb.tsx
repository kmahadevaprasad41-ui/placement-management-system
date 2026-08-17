"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Bot, X, ArrowRight, ShieldCheck, Zap, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingMascotOrb() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTooltip, setActiveTooltip] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Interactive Menu */}
      {isOpen && (
        <div className="mb-3 w-80 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">PMS AI Assistant</p>
                <p className="text-[10px] text-emerald-600 font-semibold">● Placement Engine Active</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Need help navigating? You can switch roles at any time or explore our domain engines.
          </p>

          <div className="space-y-1.5 text-xs">
            <Link href="/jobs" onClick={() => setIsOpen(false)} className="block p-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-700 transition-colors">
              <p className="font-bold text-blue-600 flex items-center justify-between">
                <span>View Job Openings & Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
              <p className="text-[10px] text-slate-400">Evaluate transparent criteria checklists</p>
            </Link>

            <Link href="/applications" onClick={() => setIsOpen(false)} className="block p-2 rounded-xl bg-slate-50 hover:bg-purple-50 dark:bg-slate-800/60 dark:hover:bg-purple-950/40 border border-slate-100 dark:border-slate-700 transition-colors">
              <p className="font-bold text-purple-600 flex items-center justify-between">
                <span>8-Stage Kanban Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </p>
              <p className="text-[10px] text-slate-400">Advance recruitment stages</p>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Animated Mascot Button */}
      <div className="relative group">
        {/* Radar Blip Wave */}
        <span className="absolute -inset-1.5 rounded-full bg-blue-500/30 animate-radar pointer-events-none" />

        {activeTooltip && !isOpen && (
          <div className="absolute right-16 top-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap shadow-xl animate-float-slow pointer-events-none">
            ✨ Interactive 3D Platform Active
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 text-white flex items-center justify-center border-t border-white/40"
          aria-label="Open AI Assistant"
        >
          <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 animate-pulse" />}
          </div>
        </button>
      </div>
    </div>
  );
}
