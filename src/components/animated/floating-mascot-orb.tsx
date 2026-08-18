"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  BrainCircuit,
  Trophy,
  Calculator,
  Radio,
  Send,
  CheckCircle2,
} from "lucide-react";

export function FloatingMascotOrb() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTooltip, setActiveTooltip] = React.useState(true);
  const [userQuery, setUserQuery] = React.useState("");
  const [botResponse, setBotResponse] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTooltip(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    if (userQuery.toLowerCase().includes("resume") || userQuery.toLowerCase().includes("ats")) {
      setBotResponse("Tip: Use our new AI Resume Analyzer to scan keyword gaps against Google & Microsoft job criteria!");
    } else if (userQuery.toLowerCase().includes("interview") || userQuery.toLowerCase().includes("mock")) {
      setBotResponse("Tip: Practice Google & Amazon technical tracks in our AI Mock Interview Studio with live timers!");
    } else if (userQuery.toLowerCase().includes("salary") || userQuery.toLowerCase().includes("ctc")) {
      setBotResponse("Tip: Check out our Salary & Take-Home Calculator to see your exact monthly in-hand deposit after tax!");
    } else {
      setBotResponse("I'm here to assist your campus placement journey! Try exploring our AI tools below or switch demo roles in the topbar.");
    }
    setUserQuery("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Interactive Menu */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-96 p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 space-y-4 text-xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 animate-pulse-glow">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>Placement AI Co-Pilot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </p>
                <p className="text-[10px] text-slate-500 font-medium">Next-Gen Career Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Chat Prompt */}
          <form onSubmit={handleAsk} className="flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask for resume, interview, or CTC tips..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {botResponse && (
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-200 animate-in fade-in duration-150 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{botResponse}</p>
            </div>
          )}

          {/* 1-Click Feature Action Tiles */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick AI Power Tools
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/resume-ai"
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 hover:border-blue-300 transition-all block group"
              >
                <div className="flex items-center gap-1.5 mb-1 text-blue-600 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ATS Scanner</span>
                </div>
                <p className="text-[10px] text-slate-500">Scan keyword gaps</p>
              </Link>

              <Link
                href="/interviews/mock-ai"
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 hover:border-purple-300 transition-all block group"
              >
                <div className="flex items-center gap-1.5 mb-1 text-purple-600 font-bold">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Mock AI Room</span>
                </div>
                <p className="text-[10px] text-slate-500">Practice live tracks</p>
              </Link>

              <Link
                href="/salary-insights"
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 transition-all block group"
              >
                <div className="flex items-center gap-1.5 mb-1 text-emerald-600 font-bold">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Salary In-Hand</span>
                </div>
                <p className="text-[10px] text-slate-500">Tax & CTC slider</p>
              </Link>

              <Link
                href="/hall-of-fame"
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 hover:border-amber-300 transition-all block group"
              >
                <div className="flex items-center gap-1.5 mb-1 text-amber-600 font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Hall of Fame</span>
                </div>
                <p className="text-[10px] text-slate-500">₹32.5L Achievers</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Animated Mascot Button */}
      <div className="relative group">
        {/* Radar Blip Wave */}
        <span className="absolute -inset-1.5 rounded-full bg-blue-500/30 animate-radar pointer-events-none" />

        {activeTooltip && !isOpen && (
          <div className="absolute right-16 top-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap shadow-xl animate-float-slow pointer-events-none flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "5s" }} />
            <span>AI Placement Co-Pilot Ready</span>
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
