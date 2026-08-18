"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Lock,
  Sparkles,
  Building2,
  TrendingUp,
  Users,
  Flame,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { TiltCard } from "@/components/ui/tilt-card";
import { signInWithFirebaseEmail, signInWithFirebaseGoogle } from "@/lib/firebase-auth";

export default function LoginPage() {
  const [email, setEmail] = React.useState("placement@institution.edu");
  const [password, setPassword] = React.useState("password123");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFirebaseLoading, setIsFirebaseLoading] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  // Standard Database Login
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

  // Firebase Email & Password Login
  const handleFirebaseEmailLogin = async () => {
    if (!email || !password) {
      toast.error("Credentials Required", "Please enter your email and password.");
      return;
    }

    setIsFirebaseLoading(true);
    try {
      const fbResult = await signInWithFirebaseEmail(email, password);
      if (!fbResult.success) {
        toast.error("Firebase Auth Error", fbResult.error || "Firebase authentication failed");
        setIsFirebaseLoading(false);
        return;
      }

      // Bridge session to backend
      const res = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fbResult.user?.email,
          name: fbResult.user?.displayName,
          firebaseUid: fbResult.user?.uid,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Firebase Auth Success", `Signed in as ${data.user.name}`);
        router.push("/dashboard");
      } else {
        toast.error("Session Sync Failed", "Could not create local session");
      }
    } catch (e: any) {
      toast.error("Firebase Login Failed", e.message);
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  // Firebase Google OAuth Sign-in
  const handleFirebaseGoogleLogin = async () => {
    setIsFirebaseLoading(true);
    try {
      const fbResult = await signInWithFirebaseGoogle();
      if (!fbResult.success) {
        toast.error("Google Sign-In Error", fbResult.error || "Firebase Google login failed");
        setIsFirebaseLoading(false);
        return;
      }

      // Bridge session to backend
      const res = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fbResult.user?.email,
          name: fbResult.user?.displayName,
          firebaseUid: fbResult.user?.uid,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Firebase Google Login", `Welcome, ${data.user.name}!`);
        router.push("/dashboard");
      } else {
        toast.error("Session Sync Failed", "Could not establish server session");
      }
    } catch (e: any) {
      toast.error("Google Auth Failed", e.message);
    } finally {
      setIsFirebaseLoading(false);
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
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Firebase Auth Ready</span>
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 space-y-5">
          {/* Firebase Google One-Click Login */}
          <div>
            <button
              type="button"
              onClick={handleFirebaseGoogleLogin}
              disabled={isFirebaseLoading}
              className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center justify-center gap-2.5 group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isFirebaseLoading ? "Connecting to Firebase..." : "Sign in with Google (Firebase)"}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">or sign in with email</span>
              </div>
            </div>
          </div>

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

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="submit"
                variant="3d-primary"
                size="md"
                isLoading={isLoading}
                className="w-full text-xs font-bold gap-1"
              >
                <span>Database Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleFirebaseEmailLogin}
                isLoading={isFirebaseLoading}
                className="w-full text-xs font-bold gap-1 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Firebase Auth</span>
              </Button>
            </div>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              ⚡ 1-Click Fast Fill Credentials:
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleFillDemo("placement@institution.edu")}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 transition-colors"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200">🛡️ Placement Officer</p>
                <p className="text-[10px] text-slate-400 truncate">placement@institution.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("student.aarav@institution.edu")}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 transition-colors"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200">🎓 Student (Aarav)</p>
                <p className="text-[10px] text-slate-400 truncate">student.aarav@institution.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("recruiter.google@google.com")}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 transition-colors"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200">🏢 Google Recruiter</p>
                <p className="text-[10px] text-slate-400 truncate">recruiter.google@google.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("management@institution.edu")}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-blue-300 transition-colors"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200">📈 Director</p>
                <p className="text-[10px] text-slate-400 truncate">management@institution.edu</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
