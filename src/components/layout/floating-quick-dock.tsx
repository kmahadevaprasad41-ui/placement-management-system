"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  BrainCircuit,
  Trophy,
  Calculator,
  Radio,
  Search,
  LayoutDashboard,
  Zap,
  Layers,
  ChevronUp,
} from "lucide-react";

export function FloatingQuickDock() {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  const dockItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "from-blue-600 to-indigo-600",
      badge: "Hub",
    },
    {
      title: "AI ATS Scanner",
      href: "/resume-ai",
      icon: Sparkles,
      color: "from-purple-600 to-indigo-600",
      badge: "AI",
    },
    {
      title: "AI Mock Interview",
      href: "/interviews/mock-ai",
      icon: BrainCircuit,
      color: "from-pink-600 to-purple-600",
      badge: "Live",
    },
    {
      title: "Achievers Hall of Fame",
      href: "/hall-of-fame",
      icon: Trophy,
      color: "from-amber-500 to-orange-600",
      badge: "Top",
    },
    {
      title: "Salary Calculator",
      href: "/salary-insights",
      icon: Calculator,
      color: "from-emerald-500 to-teal-600",
      badge: "CTC",
    },
    {
      title: "Live Drive Radar",
      href: "/drives/radar",
      icon: Radio,
      color: "from-rose-500 to-red-600",
      badge: "Radar",
    },
    {
      title: "Applications Kanban",
      href: "/applications",
      icon: Layers,
      color: "from-cyan-600 to-blue-600",
      badge: "Pipeline",
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 hidden md:flex flex-col items-center">
      {/* Floating Island Glass Container */}
      <div className="floating-dock-glass px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        {dockItems.map((item, idx) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`relative p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900 scale-110"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80"
              }`}
            >
              {/* Tooltip on Hover */}
              {hoveredIdx === idx && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xl dark:bg-slate-100 dark:text-slate-900 whitespace-nowrap animate-in fade-in zoom-in-90 duration-150 flex items-center gap-1">
                  <span>{item.title}</span>
                  <span className="text-[9px] px-1 rounded bg-white/20 dark:bg-black/10">{item.badge}</span>
                </div>
              )}

              {/* Glowing Icon */}
              <Icon
                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-115 ${
                  isActive ? "text-white dark:text-slate-900" : ""
                }`}
              />

              {/* Active Dot Indicator */}
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              )}
            </Link>
          );
        })}

        <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Global Search Trigger Key Indicator */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              ctrlKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          className="p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-center gap-1 text-xs font-bold"
          title="Search anything (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
          <kbd className="hidden lg:inline text-[9px] font-mono px-1 py-0.5 rounded bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 text-slate-500">
            Ctrl+K
          </kbd>
        </button>
      </div>
    </div>
  );
}
