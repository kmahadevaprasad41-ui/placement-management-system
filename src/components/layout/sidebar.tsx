"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Layers,
  CalendarDays,
  Video,
  FileCheck2,
  Award,
  BarChart3,
  FileSpreadsheet,
  Megaphone,
  History,
  Settings,
  User,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Sparkles,
  BrainCircuit,
  Trophy,
  Calculator,
  Radio,
} from "lucide-react";
import { Role, SessionUser } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: SessionUser;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: Role[];
  badge?: string;
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    // 1. Dashboard
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "DEPARTMENT_COORDINATOR", "STUDENT", "RECRUITER", "MANAGEMENT"],
    },

    // 2. AI Intelligence & Career Suite
    {
      title: "AI Resume Analyzer",
      href: "/resume-ai",
      icon: Sparkles,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "STUDENT", "DEPARTMENT_COORDINATOR"],
      badge: "AI",
    },
    {
      title: "AI Mock Interview",
      href: "/interviews/mock-ai",
      icon: BrainCircuit,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "STUDENT", "DEPARTMENT_COORDINATOR"],
      badge: "Live",
    },
    {
      title: "Achievers Hall of Fame",
      href: "/hall-of-fame",
      icon: Trophy,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "DEPARTMENT_COORDINATOR", "STUDENT", "RECRUITER", "MANAGEMENT"],
      badge: "Top",
    },
    {
      title: "Salary & CTC Calculator",
      href: "/salary-insights",
      icon: Calculator,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "DEPARTMENT_COORDINATOR", "STUDENT", "RECRUITER", "MANAGEMENT"],
      badge: "New",
    },
    {
      title: "Drive Live Radar",
      href: "/drives/radar",
      icon: Radio,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "RECRUITER", "STUDENT", "DEPARTMENT_COORDINATOR"],
      badge: "Radar",
    },

    // 3. Student Self-Service
    {
      title: "My Profile",
      href: "/students/me",
      icon: User,
      roles: ["STUDENT"],
    },
    {
      title: "My Resumes",
      href: "/students/resumes",
      icon: FileCheck2,
      roles: ["STUDENT"],
    },

    // 4. Operational & Directory
    {
      title: "Students Directory",
      href: "/students",
      icon: Users,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "DEPARTMENT_COORDINATOR", "MANAGEMENT"],
    },
    {
      title: "Companies",
      href: "/companies",
      icon: Building2,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "DEPARTMENT_COORDINATOR", "STUDENT", "RECRUITER", "MANAGEMENT"],
    },
    {
      title: "Job Postings",
      href: "/jobs",
      icon: Briefcase,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "DEPARTMENT_COORDINATOR", "STUDENT", "RECRUITER", "MANAGEMENT"],
    },

    // 5. Recruitment Workflow
    {
      title: "Applications (Kanban)",
      href: "/applications",
      icon: Layers,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "RECRUITER", "DEPARTMENT_COORDINATOR"],
      badge: "Pipeline",
    },
    {
      title: "Placement Drives",
      href: "/drives",
      icon: CalendarDays,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "RECRUITER", "STUDENT"],
    },
    {
      title: "Assessments / Tests",
      href: "/tests",
      icon: ClipboardList,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "RECRUITER", "STUDENT"],
    },
    {
      title: "Interviews",
      href: "/interviews",
      icon: Video,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "RECRUITER", "STUDENT"],
    },
    {
      title: "Selections & Offers",
      href: "/offers",
      icon: Award,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "STUDENT", "RECRUITER", "MANAGEMENT"],
    },

    // 6. Intelligence & Governance
    {
      title: "Placement Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "MANAGEMENT", "DEPARTMENT_COORDINATOR"],
    },
    {
      title: "Reports Studio",
      href: "/reports",
      icon: FileSpreadsheet,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "MANAGEMENT"],
    },
    {
      title: "Announcements",
      href: "/announcements",
      icon: Megaphone,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER", "DEPARTMENT_COORDINATOR", "STUDENT", "RECRUITER", "MANAGEMENT"],
    },
    {
      title: "Audit Trail",
      href: "/audit-logs",
      icon: History,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER"],
    },
    {
      title: "Institution Settings",
      href: "/settings",
      icon: Settings,
      roles: ["SUPER_ADMIN", "PLACEMENT_OFFICER"],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border-t border-blue-400/50 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100 truncate">
                Placement Portal
              </h1>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                Enterprise Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/60 dark:text-blue-300 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                    )}
                  />
                  <span>{item.title}</span>
                </div>

                {item.badge && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Card Footer */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
              className="h-8 w-8 rounded-full bg-blue-100 object-cover"
            />
            <div className="overflow-hidden flex-1">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
              <p className="truncate text-[10px] text-slate-500 font-medium capitalize">{user.role.toLowerCase().replace("_", " ")}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
