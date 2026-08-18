"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SessionUser } from "@/types";
import {
  Award,
  Sparkles,
  Trophy,
  Crown,
  Building2,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Flame,
  Star,
  Quote,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { Modal } from "@/components/ui/modal";

export default function HallOfFamePage() {
  const [currentUser] = React.useState<SessionUser>({
    id: "demo_user",
    email: "student.aarav@institution.edu",
    name: "Aarav Sharma",
    role: "STUDENT",
  });

  const [selectedDept, setSelectedDept] = React.useState("ALL");
  const [selectedTier, setSelectedTier] = React.useState("ALL");
  const [selectedAchiever, setSelectedAchiever] = React.useState<any | null>(null);
  const [showConfetti, setShowConfetti] = React.useState(true);

  // Confetti timeout on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const achievers = [
    {
      id: "aarav-1",
      name: "Aarav Sharma",
      rollNumber: "CS101",
      dept: "CSE",
      company: "Google",
      role: "Software Engineer (Core Systems)",
      ctc: "₹32.5 LPA",
      tier: "SUPER_DREAM",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      cgpa: "9.48",
      keySkills: ["Distributed Systems", "C++", "Raft Consensus", "Docker"],
      advice: "Focus deeply on fundamentals — understand how operating systems handle concurrency, and practice writing clean, modular code rather than memorizing algorithms.",
      interviewSummary: "3 rounds of algorithmic problem solving followed by system architecture discussion on distributed caching and concurrency.",
    },
    {
      id: "diya-2",
      name: "Diya Patel",
      rollNumber: "IS042",
      dept: "ISE",
      company: "Microsoft",
      role: "Software Development Engineer (Azure)",
      ctc: "₹28.0 LPA",
      tier: "SUPER_DREAM",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      cgpa: "9.15",
      keySkills: ["TypeScript", "Azure Cloud", "REST APIs", "SQL"],
      advice: "Mock interviews made all the difference. Be vocal with your thought process and always ask clarifying questions about edge cases before coding.",
      interviewSummary: "Online challenge + 3 technical rounds focusing on object-oriented system design and cloud event architectures.",
    },
    {
      id: "rohan-3",
      name: "Rohan Varma",
      rollNumber: "CS103",
      dept: "CSE",
      company: "Amazon",
      role: "Software Development Engineer (AWS)",
      ctc: "₹26.5 LPA",
      tier: "SUPER_DREAM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      cgpa: "8.64",
      keySkills: ["Java", "System Design", "AWS DynamoDB", "Multithreading"],
      advice: "Align every project in your resume with real metrics — throughput, percentage speedups, or automated hours saved. It immediately catches the recruiter's eye.",
      interviewSummary: "4 rounds including 2 system design sessions and a rigorous Amazon Bar Raiser behavioral evaluation using STAR method.",
    },
    {
      id: "kavya-4",
      name: "Kavya Reddy",
      rollNumber: "EC015",
      dept: "ECE",
      company: "Bosch Global Software",
      role: "Software Developer (Mobility & IoT)",
      ctc: "₹12.0 LPA",
      tier: "DREAM",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-Logo.svg",
      cgpa: "8.82",
      keySkills: ["Embedded C++", "CAN Bus", "RTOS", "Microcontrollers"],
      advice: "Build hardware & firmware projects that demonstrate real-world sensor communication and firmware debugging skills.",
      interviewSummary: "Written microcontroller round followed by technical interview on RTOS schedulers and automotive telematics.",
    },
    {
      id: "siddharth-5",
      name: "Siddharth Rao",
      rollNumber: "AI019",
      dept: "AIML",
      company: "Goldman Sachs",
      role: "Quantitative Technology Analyst",
      ctc: "₹30.0 LPA",
      tier: "SUPER_DREAM",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
      cgpa: "9.22",
      keySkills: ["Python", "C++", "Quantitative Finance", "Probability"],
      advice: "Master discrete mathematics and probabilistic algorithms. Practice mental math and risk trade-off estimations.",
      interviewSummary: "Aptitude + Math round on HackerRank, followed by 3 rounds of algorithms and low-latency system design.",
    },
    {
      id: "sneha-6",
      name: "Sneha Nair",
      rollNumber: "CS122",
      dept: "CSE",
      company: "Adobe Systems",
      role: "Member of Technical Staff",
      ctc: "₹24.0 LPA",
      tier: "SUPER_DREAM",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
      cgpa: "8.95",
      keySkills: ["React", "WebGL", "TypeScript", "Computer Graphics"],
      advice: "Combine strong frontend UI craftsmanship with solid computer science data structure fundamentals.",
      interviewSummary: "Live coding challenge + 3 rounds covering WebGL shaders, state management, and memory profiling.",
    },
  ];

  const filteredAchievers = achievers.filter((a) => {
    if (selectedDept !== "ALL" && a.dept !== selectedDept) return false;
    if (selectedTier !== "ALL" && a.tier !== selectedTier) return false;
    return true;
  });

  return (
    <AppShell user={currentUser}>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Animated Celebration Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-purple-900 p-6 sm:p-8 text-white shadow-2xl border border-amber-400/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                <Crown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>Class of 2026-27 Placement Champions</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Achievers Hall of Fame
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
                Celebrating outstanding placement triumphs across premier global tech leaders and institutional recruitment drives. Read verified interview strategies and key tips from top placed engineers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <p className="text-3xl font-black text-amber-300">₹32.5 LPA</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-100">Highest Campus CTC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Department:</span>
            {["ALL", "CSE", "ISE", "ECE", "AIML"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDept === d
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Tier:</span>
            {["ALL", "SUPER_DREAM", "DREAM"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTier === t
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Holographic Achievers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievers.map((achiever) => (
            <TiltCard
              key={achiever.id}
              className="p-6 flex flex-col justify-between h-full group hover:shadow-2xl transition-all border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400"
            >
              <div>
                {/* Header with Company Logo & CTC Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={achiever.avatar}
                      alt={achiever.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                        {achiever.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {achiever.dept} • Roll: {achiever.rollNumber}
                      </p>
                    </div>
                  </div>

                  <Badge variant="emerald" size="md" className="font-extrabold shadow-sm">
                    {achiever.ctc}
                  </Badge>
                </div>

                {/* Company & Role */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{achiever.role}</p>
                    <p className="text-[11px] text-blue-600 font-semibold">{achiever.company}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    CGPA {achiever.cgpa}
                  </span>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {achiever.keySkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Quote Excerpt */}
                <div className="relative p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 text-xs text-slate-600 dark:text-slate-300 italic">
                  <Quote className="w-3.5 h-3.5 text-amber-500 absolute -top-1.5 -left-1.5" />
                  <p className="line-clamp-2">"{achiever.advice}"</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Offer Accepted
                </span>
                <Button
                  variant="3d-primary"
                  size="sm"
                  onClick={() => setSelectedAchiever(achiever)}
                  className="text-xs gap-1"
                >
                  <span>Read Interview Strategy</span>
                </Button>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Achiever Strategy Detail Modal */}
        {selectedAchiever && (
          <Modal
            isOpen={Boolean(selectedAchiever)}
            onClose={() => setSelectedAchiever(null)}
            title={`Placement Triumph — ${selectedAchiever.name}`}
            description={`${selectedAchiever.company} (${selectedAchiever.ctc}) • ${selectedAchiever.role}`}
            size="lg"
          >
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Words of Advice to Juniors
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  "{selectedAchiever.advice}"
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Interview Process & Key Focus Rounds
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {selectedAchiever.interviewSummary}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Core Technologies Mastered
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedAchiever.keySkills.map((s: string) => (
                    <Badge key={s} variant="blue" size="md">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setSelectedAchiever(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
