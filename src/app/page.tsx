"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  ChevronRight,
  Activity,
  Flame,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { Hero3DScene } from "@/components/3d/hero-3d-scene";
import { PlacementMarquee } from "@/components/animated/placement-marquee";
import { ParticlesCanvas } from "@/components/3d/particles-canvas";
import { Orbital3DRings } from "@/components/3d/orbital-3d-rings";
import { FloatingMascotOrb } from "@/components/animated/floating-mascot-orb";

export default function LandingPage() {
  const router = useRouter();
  const [quickLoginRole, setQuickLoginRole] = React.useState<string | null>(null);

  const handleQuickLogin = async (email: string) => {
    setQuickLoginRole(email);
    try {
      const res = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error("Quick login failed", e);
    } finally {
      setQuickLoginRole(null);
    }
  };

  const roleDemoCards = [
    {
      role: "Placement Officer",
      email: "placement@institution.edu",
      icon: ShieldCheck,
      badge: "Placement Cell Lead",
      accent: "from-blue-600 to-indigo-600",
      btnVariant: "3d-primary" as const,
      description: "Manage 50+ students across engineering branches, verify academic credentials, override eligibility, and release offer letters.",
    },
    {
      role: "Student (Aarav - Placed 32.5L)",
      email: "student.aarav@institution.edu",
      icon: GraduationCap,
      badge: "Roll: CS101",
      accent: "from-emerald-600 to-teal-600",
      btnVariant: "3d-emerald" as const,
      description: "Check transparent eligibility breakdowns, manage tailored resumes, review 32.5 LPA Google offer letter, and track onboarding.",
    },
    {
      role: "Student (Ananya - Backlog Test)",
      email: "student.ananya@institution.edu",
      icon: GraduationCap,
      badge: "Roll: IS042",
      accent: "from-amber-500 to-orange-600",
      btnVariant: "3d-secondary" as const,
      description: "Experience the transparent rule engine flagging active backlog ineligibility with red crosses (✕) and test officer exemptions.",
    },
    {
      role: "Recruiter (Google APAC)",
      email: "recruiter.google@google.com",
      icon: Building2,
      badge: "Corporate Partner",
      accent: "from-purple-600 to-pink-600",
      btnVariant: "3d-purple" as const,
      description: "Manage candidate pipeline across the 8-stage interactive Kanban board, schedule interview rounds, and record scorecard ratings.",
    },
    {
      role: "Department Coordinator",
      email: "coordinator.cse@institution.edu",
      icon: Users,
      badge: "Academic Review",
      accent: "from-cyan-600 to-blue-600",
      btnVariant: "3d-secondary" as const,
      description: "Review cohort graduation status, verify sem-wise transcripts, and track departmental placement conversion metrics.",
    },
    {
      role: "Management / Director",
      email: "management@institution.edu",
      icon: TrendingUp,
      badge: "Executive Insights",
      accent: "from-slate-800 to-slate-950",
      btnVariant: "3d-dark" as const,
      description: "Institutional placement intelligence dashboard, average & highest CTC trends, salary quartiles, and compliance reports.",
    },
  ];

  const engineeringDepartments = [
    { code: "CSE", name: "Computer Science & Engineering", seats: "120 Candidates" },
    { code: "ISE", name: "Information Science & Engineering", seats: "60 Candidates" },
    { code: "AIML", name: "CS - Artificial Intelligence & ML", seats: "60 Candidates" },
    { code: "AIDS", name: "CS - Data Science Engineering", seats: "60 Candidates" },
    { code: "ECE", name: "Electronics & Communication", seats: "60 Candidates" },
    { code: "CV", name: "Civil Engineering", seats: "60 Candidates" },
    { code: "ME", name: "Mechanical Engineering", seats: "60 Candidates" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Interactive Background Particle Mesh */}
      <ParticlesCanvas />

      {/* 3D Dynamic Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-400/15 via-purple-400/15 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border-t border-blue-400/50 animate-float-slow shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg tracking-tight leading-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>Placement Management System</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Enterprise Career & Recruitment SaaS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="font-bold">
                Sign In
              </Button>
            </Link>
            <Button
              variant="3d-primary"
              size="sm"
              onClick={() => handleQuickLogin("placement@institution.edu")}
              isLoading={quickLoginRole === "placement@institution.edu"}
              className="gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "5s" }} />
              <span>Launch Demo Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Infinite Scrolling Live Placement Marquee */}
      <PlacementMarquee />

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-300 shadow-sm animate-pulse-glow">
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Campus Recruitment & Placement Platform 2026-27</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
            Complete Placement Lifecycle{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Management SaaS
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Manage 50+ students, multi-variable eligibility rules, interview conflict scheduling, 8-stage Kanban tracking, dream offer policies, and live executive analytics.
          </p>

          {/* 3D Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="3d-primary"
              size="lg"
              onClick={() => handleQuickLogin("placement@institution.edu")}
              isLoading={quickLoginRole === "placement@institution.edu"}
              className="gap-2 text-sm shadow-xl"
            >
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Explore as Placement Officer</span>
            </Button>

            <Button
              variant="3d-emerald"
              size="lg"
              onClick={() => handleQuickLogin("student.aarav@institution.edu")}
              isLoading={quickLoginRole === "student.aarav@institution.edu"}
              className="gap-2 text-sm shadow-xl"
            >
              <GraduationCap className="w-4 h-4 animate-bounce" style={{ animationDuration: "3s" }} />
              <span>Explore as Student (32.5L Offer)</span>
            </Button>
          </div>
        </div>

        {/* 3D Interactive Hero Canvas & Mockup Scene */}
        <Hero3DScene />

        {/* Academic Departments Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Academic Engineering Disciplines
              </h3>
              <p className="text-xs text-slate-500">
                Placement cohorts and department screening filters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 text-xs">
            {engineeringDepartments.map((dept) => (
              <div
                key={dept.code}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 card-3d-lift"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono text-sm">{dept.code}</span>
                  <Badge variant="secondary" size="sm">{dept.seats}</Badge>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{dept.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Orbital Revolving Gyro Rings */}
        <Orbital3DRings />

        {/* 4 Pillars Feature Cards with 3D Elevate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl transition-all card-3d-lift dark:border-slate-800 dark:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Eligibility Engine</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Rule breakdowns with transparent green checkmarks & officer override workflow.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl transition-all card-3d-lift dark:border-slate-800 dark:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">8-Stage Kanban</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Applied → Shortlist → Test → Interview → Selected → Offered → Accepted → Joined.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl transition-all card-3d-lift dark:border-slate-800 dark:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Conflict Detector</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Prevents double-booking across simultaneous interview slots and tests.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl transition-all card-3d-lift dark:border-slate-800 dark:bg-slate-900/80 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Dream Policy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Configurable multi-offer & 1.5x multiplier compensation gates.
            </p>
          </div>
        </div>

        {/* 1-Click Interactive 3D Role Test Cards */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              1-Click Interactive Role Experience
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any role card below to instantly test the platform with seeded production-grade data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roleDemoCards.map((card) => {
              const Icon = card.icon;
              const isLoggingIn = quickLoginRole === card.email;

              return (
                <TiltCard key={card.email} className="p-6 flex flex-col justify-between h-full group">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-white shadow-lg border-t border-white/30 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                            {card.role}
                          </h4>
                          <p className="text-xs text-slate-500 font-mono">{card.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Badge variant="blue" size="sm">
                        {card.badge}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Password: password123</span>
                    <Button
                      variant={card.btnVariant}
                      size="sm"
                      isLoading={isLoggingIn}
                      onClick={() => handleQuickLogin(card.email)}
                      className="gap-1 text-xs"
                    >
                      <span>Launch Role</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating 3D AI Assistant Companion Orb */}
      <FloatingMascotOrb />

      {/* Generic SaaS Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026-2027 Campus Placement Management System (PMS) • All Rights Reserved</p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Version 2.0 Production</span>
            <span>•</span>
            <Link href="/login" className="text-blue-600 hover:underline font-bold">
              Staff & Student Portal Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
