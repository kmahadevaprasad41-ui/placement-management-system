"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, ShieldCheck, UserCheck, Lock, Sparkles, Building2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { TiltCard } from "@/components/ui/tilt-card";

export default function LoginPage() {
  const [email, setEmail] = React.useState("placement@institution.edu");
  const [password, setPassword] = React.useState("password123");
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Authentication Failed", data.error || "Invalid email or password");
        return;
      }

      toast.success("Welcome Back", `Logged in successfully as ${data.user.name}`);
      router.push("/dashboard");
    } catch (err) {
      toast.error("Network Error", "Could not reach authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-3 border-t border-blue-400/40 animate-float-slow">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
          Placement Portal Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Campus Placement & Recruitment Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                placeholder="name@institution.edu"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 font-semibold cursor-pointer">
                  Default: password123
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="3d-primary"
              size="md"
              className="w-full mt-2 font-bold"
              isLoading={isLoading}
            >
              Sign In to Placement Dashboard
            </Button>
          </form>

          {/* Quick Demo Fill Options */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              1-Click Demo Role Switcher
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo("placement@institution.edu")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Placement Officer
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">placement@institution.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("student.aarav@institution.edu")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 dark:bg-slate-800 dark:border-slate-700 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Student (Placed 32.5L)
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">student.aarav@institution.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("recruiter.google@google.com")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 dark:bg-slate-800 dark:border-slate-700 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" /> Recruiter
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">recruiter.google@google.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("management@institution.edu")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" /> Management
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">management@institution.edu</p>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
