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
import { Floating3DShapes } from "@/components/3d/floating-3d-shapes";
import { Interactive3DFlipCard } from "@/components/3d/interactive-3d-flip-card";
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
      {/* Interactive Background Particle Mesh & 3D Wireframe Polyhedrons */}
      <ParticlesCanvas />
      <Floating3DShapes />

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
                Enterprise Career & Recruitment Platform
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

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-glow-blue">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Placement Management System
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

          {/* Glowing Metrics Quick Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl glass-panel-pro text-center space-y-0.5 card-3d-lift">
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">52 Active</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Profiles</p>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel-pro text-center space-y-0.5 card-3d-lift">
              <p className="text-xl font-black text-purple-600 dark:text-purple-400">8 Tier-1/2</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hiring Partners</p>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel-pro text-center space-y-0.5 card-3d-lift">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹32.5 LPA</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Peak Offer (Google)</p>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel-pro text-center space-y-0.5 card-3d-lift">
              <p className="text-xl font-black text-amber-600 dark:text-amber-400">100% Zero</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Double-Booking</p>
            </div>
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

        {/* 4 Core Pillars with 3D True Perspective Flip Interaction */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Core Platform Engines</span>
                <Badge variant="purple" size="sm">3D Interactive Flip</Badge>
              </h3>
              <p className="text-xs text-slate-500">
                Click any engine card to flip in 3D and inspect underlying algorithms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Interactive3DFlipCard
              frontBadge="Engine 1"
              frontTitle="Eligibility Rule Engine"
              frontSubtitle="Transparent multi-variable criteria evaluator with instant pass/fail checklists."
              frontMetrics={[
                { label: "Cutoff Match", value: "CGPA & 10/12th" },
                { label: "Exemption", value: "Officer Override" },
              ]}
              backTitle="Transparent Evaluation"
              backDescription="Evaluates student eligibility across 6 academic parameters before application submission."
              backPoints={[
                "Verifies allowed engineering departments",
                "Checks active and historical backlog limits",
                "Permits placement officer overrides with audit logs",
              ]}
            />

            <Interactive3DFlipCard
              frontBadge="Engine 2"
              frontTitle="8-Stage Kanban Flow"
              frontSubtitle="Visual candidate progression tracking from initial application to date of joining."
              frontMetrics={[
                { label: "Pipeline", value: "8 Stages" },
                { label: "Status", value: "Live Drag & Drop" },
              ]}
              backTitle="Automated Transitions"
              backDescription="Recruiters and placement officers manage candidates with real-time status triggers."
              backPoints={[
                "Applied → Shortlist → Test → Interview",
                "Selected → Offered → Accepted → Joined",
                "Automated email & in-app notification dispatches",
              ]}
            />

            <Interactive3DFlipCard
              frontBadge="Engine 3"
              frontTitle="Interview Conflict Engine"
              frontSubtitle="Intelligent time slot collision detector preventing student double-booking."
              frontMetrics={[
                { label: "Collision Rate", value: "0% Overlaps" },
                { label: "Resolution", value: "Auto-Detected" },
              ]}
              backTitle="Slot Conflict Detection"
              backDescription="Scans company drive schedules and individual interview sessions across all panels."
              backPoints={[
                "Detects time slot collisions with 15-min buffers",
                "Visual red warning badge with conflicting interview title",
                "Prevents simultaneous student scheduling",
              ]}
            />

            <Interactive3DFlipCard
              frontBadge="Engine 4"
              frontTitle="Multiple-Offer Policy"
              frontSubtitle="Institutional dream & super-dream tier compensation gate policies."
              frontMetrics={[
                { label: "Dream Multiplier", value: "1.5x CTC" },
                { label: "Super Dream", value: "≥ ₹20 LPA" },
              ]}
              backTitle="Policy Enforcement"
              backDescription="Governs campus offer acceptance rules ensuring fair distribution of job offers."
              backPoints={[
                "Prevents hoarding of multiple basic tier offers",
                "Allows dream upgrades only if CTC exceeds 1.5x",
                "Unrestricted applications for Super Dream tier (₹20L+)",
              ]}
            />
          </div>
        </div>

        {/* Next-Gen Interactive Career Intelligence Suite */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 border border-purple-200 text-purple-800 dark:bg-purple-950/60 dark:border-purple-900 dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" style={{ animationDuration: "5s" }} />
              <span>Next-Gen Placement Superpowers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              AI Tools & Career Intelligence Suite
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              Empowering students with AI-driven ATS resume scanning, live mock interview coaching, salary take-home calculators, and live drive radars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tool 1: AI Resume Analyzer */}
            <Link href="/resume-ai" className="block group">
              <div className="p-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/30 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all card-3d-lift h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <Badge variant="blue" size="sm">ATS Scanner</Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    AI Resume Analyzer
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Scan resumes against live job criteria, detect keyword gaps, and generate quantified bullet points.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Launch ATS Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Tool 2: AI Mock Interview */}
            <Link href="/interviews/mock-ai" className="block group">
              <div className="p-6 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50/60 via-white to-pink-50/30 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all card-3d-lift h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <Badge variant="purple" size="sm">Live AI Room</Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
                    AI Mock Interview Simulator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Practice company-specific tracks with an AI interviewer persona, speech input, and instant scorecards.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600">
                  <span>Start Mock Session</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Tool 3: Achievers Hall of Fame */}
            <Link href="/hall-of-fame" className="block group">
              <div className="p-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all card-3d-lift h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <Badge variant="amber" size="sm">₹32.5L Peak</Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                    Achievers Hall of Fame
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Explore top placed students, holographic offer showcases, and verified interview strategies.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600">
                  <span>View Hall of Fame</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Tool 4: Salary Calculator */}
            <Link href="/salary-insights" className="block group">
              <div className="p-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all card-3d-lift h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <Badge variant="emerald" size="sm">Tax & In-Hand</Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                    Salary & In-Hand Calculator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Interactive CTC vs Take-Home pay explorer with base/bonus splits, PF, and tax estimations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600">
                  <span>Calculate In-Hand Pay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Tool 5: Drive Radar */}
            <Link href="/drives/radar" className="block group sm:col-span-2 lg:col-span-2">
              <div className="p-6 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/30 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all card-3d-lift h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> Live Stepper
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                    Drive Live Radar & Countdown Stepper
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Track stage-by-stage hiring pipelines in real time with countdown clocks and one-click calendar sync.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Open Live Drive Radar</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
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
