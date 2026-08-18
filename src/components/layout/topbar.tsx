"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building2,
  Users,
  TrendingUp,
  Menu,
} from "lucide-react";
import { SessionUser } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  user: SessionUser;
  onOpenSidebar?: () => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export function Topbar({ user, onOpenSidebar, onOpenSearch, onOpenNotifications, unreadCount = 0 }: TopbarProps) {
  const router = useRouter();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = React.useState(false);

  const demoAccounts = [
    { label: "Placement Officer", email: "placement@institution.edu", icon: ShieldCheck, color: "text-blue-600" },
    { label: "Student (Aarav - Placed 32.5L)", email: "student.aarav@institution.edu", icon: GraduationCap, color: "text-emerald-600" },
    { label: "Student (Ananya - Backlog)", email: "student.ananya@institution.edu", icon: GraduationCap, color: "text-amber-600" },
    { label: "Recruiter (Google APAC)", email: "recruiter.google@google.com", icon: Building2, color: "text-purple-600" },
    { label: "CSE Dept Coordinator", email: "coordinator.cse@institution.edu", icon: Users, color: "text-cyan-600" },
    { label: "Management / Director", email: "management@institution.edu", icon: TrendingUp, color: "text-slate-600" },
  ];

  const handleSwitchRole = async (email: string) => {
    setIsSwitchingRole(true);
    setIsRoleMenuOpen(false);
    try {
      const res = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 shadow-sm">
      {/* Left: Mobile Menu Trigger & Search Input Bar */}
      <div className="flex items-center gap-2 sm:gap-3 w-72 sm:w-96">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={onOpenSearch || (() => {})}
          className="flex items-center justify-between w-full h-9 px-3.5 text-xs text-slate-400 bg-slate-100/90 hover:bg-slate-200/90 hover:text-slate-700 rounded-xl border border-slate-200/90 transition-all dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-400 group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span>Search students, jobs, drives...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600 text-slate-500 shadow-xs">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Actions: 1-Click Role Switcher + Notifications + Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 3D Tactile Role Switcher */}
        <div className="relative">
          <Button
            variant="3d-primary"
            size="sm"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="gap-1.5 text-xs shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="hidden md:inline">Switch Demo Role</span>
            <ChevronDown className="w-3 h-3" />
          </Button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 dark:bg-slate-900 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                1-Click Role Switcher
              </div>
              <div className="mt-1 space-y-1">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  const isActive = account.email === user.email;

                  return (
                    <button
                      key={account.email}
                      onClick={() => handleSwitchRole(account.email)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${account.color}`} />
                      <div className="truncate flex-1">
                        <p className="truncate font-bold">{account.label}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{account.email}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications || (() => {})}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
              className="w-8 h-8 rounded-full bg-blue-100 object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="hidden lg:block text-left text-xs">
              <p className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 dark:bg-slate-900 dark:border-slate-800">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
