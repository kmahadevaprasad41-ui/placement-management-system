"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SessionUser } from "@/types";
import {
  Sparkles,
  Bot,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Download,
  Building2,
  Layers,
  Search,
  Key,
  HelpCircle,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { AIAgentAuditResult } from "@/lib/ai-agent";

export default function ResumeAIPage() {
  const toast = useToast();
  const [currentUser] = React.useState<SessionUser>({
    id: "demo_user",
    email: "student.aarav@institution.edu",
    name: "Aarav Sharma",
    role: "STUDENT",
  });

  const [selectedJob, setSelectedJob] = React.useState("google-swe");
  const [resumeText, setResumeText] = React.useState(
    `AARAV SHARMA | Computer Science & Engineering | CGPA: 9.48
Email: student.aarav@institution.edu | GitHub: github.com/aarav-sharma | LinkedIn: linkedin.com/in/aarav-sharma

TECHNICAL SKILLS:
- Languages: C++, Java, TypeScript, Python, SQL
- Technologies: Distributed Systems, Raft Consensus, Docker, Redis, PostgreSQL, Node.js, React, Git, Linux

EXPERIENCE & PROJECTS:
1. Distributed Key-Value Store (Raft Protocol)
   - Built a distributed fault-tolerant key-value database in C++ implementing Raft consensus algorithm.
   - Supported log replication and leader election across 5 cluster nodes. Handled node crash recovery.

2. Microservices Backend API
   - Built a backend API in Node.js for managing users and reduced server response times.
   - Added Redis in-memory caching to optimize query performance and session storage.

3. Campus Placement Management System
   - Engineered full-stack recruitment portal in Next.js, React, and TypeScript with role-based access control.`
  );

  const [isAgentRunning, setIsAgentRunning] = React.useState(false);
  const [agentStep, setAgentStep] = React.useState(0);
  const [auditResult, setAuditResult] = React.useState<AIAgentAuditResult | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = React.useState(false);

  const targetJobs = [
    {
      id: "google-swe",
      title: "Google — Software Engineer (Core Systems)",
      ctc: "₹32.5 LPA",
      requiredSkills: ["Distributed Systems", "C++", "Java", "Data Structures", "Algorithms", "Concurrency", "System Design", "gRPC", "Docker"],
    },
    {
      id: "msft-idc",
      title: "Microsoft — SDE 1 (Azure Platform)",
      ctc: "₹28.0 LPA",
      requiredSkills: ["TypeScript", "C#", "Azure", "Cloud Architecture", "REST APIs", "SQL", "Microservices", "CI/CD"],
    },
    {
      id: "amazon-sde",
      title: "Amazon — SDE (AWS Platform)",
      ctc: "₹26.5 LPA",
      requiredSkills: ["Java", "Distributed Databases", "AWS Lambda", "DynamoDB", "Multithreading", "Algorithms", "Object-Oriented Design"],
    },
    {
      id: "infosys-ses",
      title: "Infosys — Digital Specialist Engineer",
      ctc: "₹9.5 LPA",
      requiredSkills: ["Python", "Java", "Spring Boot", "React", "SQL", "Full Stack", "Problem Solving", "Git"],
    },
    {
      id: "bosch-mobility",
      title: "Bosch Global — SDE (Mobility & IoT)",
      ctc: "₹12.0 LPA",
      requiredSkills: ["Embedded C++", "RTOS", "CAN Bus", "Microcontrollers", "IoT", "Linux", "Git"],
    },
  ];

  const currentJobData = targetJobs.find((j) => j.id === selectedJob) || targetJobs[0];

  // Run initial AI Agent audit on mount
  React.useEffect(() => {
    runAgentAudit();
  }, [selectedJob]);

  const runAgentAudit = async () => {
    setIsAgentRunning(true);
    setAgentStep(1);

    const stepTimer1 = setTimeout(() => setAgentStep(2), 250);
    const stepTimer2 = setTimeout(() => setAgentStep(3), 500);

    try {
      const res = await fetch("/api/ai/resume-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetJobId: selectedJob,
          targetJobTitle: currentJobData.title,
          studentName: currentUser.name,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setAgentStep(4);
        setTimeout(() => {
          setAuditResult(json.data);
          setIsAgentRunning(false);
          toast.success("AI Agent Audit Complete", `Analyzed against ${currentJobData.title}`);
        }, 300);
      }
    } catch (e) {
      console.error("AI Agent error:", e);
      setIsAgentRunning(false);
    }

    return () => {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    };
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    toast.success("Copied to Clipboard", "Text copied successfully.");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AppShell user={currentUser}>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Bot className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Autonomous AI Career Agent</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                AI Resume Analyzer & ATS Agent
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Autonomous AI agent that parses resume taxonomy, benchmarks against live corporate recruitment matrices, detects ATS red flags, and generates quantified bullet point rewrites.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>API Key Info</span>
              </button>

              <Button
                variant="3d-primary"
                size="md"
                onClick={runAgentAudit}
                isLoading={isAgentRunning}
                className="gap-2 text-xs font-bold shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run AI Agent Audit</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Target Job Selector & Resume Source */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target Job Selector */}
          <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Target Campus Opening</h3>
                <p className="text-[11px] text-slate-500">Benchmark your resume against this role</p>
              </div>
            </div>

            <div className="space-y-2">
              {targetJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                    selectedJob === job.id
                      ? "bg-blue-50/80 border-blue-400 text-blue-900 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-200 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{job.title.split("—")[0].trim()}</span>
                    <Badge variant="emerald" size="sm">{job.ctc}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5 truncate">{job.title.split("—")[1] || ""}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Resume Text Input / Preload */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Resume Source Content</h3>
                  <p className="text-[11px] text-slate-500">Live resume text parsed from student profile</p>
                </div>
              </div>
              <Badge variant="purple" size="sm">Aarav Sharma (CSE)</Badge>
            </div>

            <textarea
              rows={7}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 resize-none leading-relaxed"
              placeholder="Paste complete resume text here..."
            />

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>{resumeText.split(/\s+/).length} words • {resumeText.length} characters</span>
              <Button
                variant="outline"
                size="sm"
                onClick={runAgentAudit}
                isLoading={isAgentRunning}
                className="text-xs font-bold gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Analyze</span>
              </Button>
            </div>
          </div>
        </div>

        {/* AI Agent Real-Time Thinking Stepper (When Running) */}
        {isAgentRunning && (
          <div className="rounded-3xl border border-blue-300 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-md dark:border-blue-900 dark:bg-slate-900 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
              <Bot className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: "3s" }} />
              <span>AI Resume Agent is Auditing Your Profile...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
              <div className={`p-2.5 rounded-xl border ${agentStep >= 1 ? "bg-white border-blue-400 text-blue-700 font-bold" : "text-slate-400 border-slate-200"}`}>
                1. Parsing Skills Taxonomy
              </div>
              <div className={`p-2.5 rounded-xl border ${agentStep >= 2 ? "bg-white border-indigo-400 text-indigo-700 font-bold" : "text-slate-400 border-slate-200"}`}>
                2. Benchmarking Criteria
              </div>
              <div className={`p-2.5 rounded-xl border ${agentStep >= 3 ? "bg-white border-purple-400 text-purple-700 font-bold" : "text-slate-400 border-slate-200"}`}>
                3. ATS Scoring & Red Flags
              </div>
              <div className={`p-2.5 rounded-xl border ${agentStep >= 4 ? "bg-white border-emerald-400 text-emerald-700 font-bold" : "text-slate-400 border-slate-200"}`}>
                4. Generating AI Rewrites
              </div>
            </div>
          </div>
        )}

        {/* Audit Results Section */}
        {auditResult && !isAgentRunning && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Scorecard & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circular Overall ATS Gauge */}
              <TiltCard className="p-6 flex flex-col items-center justify-between text-center border-2 border-slate-200 dark:border-slate-800">
                <div className="w-full text-left flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall ATS Score</span>
                  <Badge variant={auditResult.overallAtsScore >= 80 ? "emerald" : "amber"} size="sm">
                    {auditResult.overallAtsScore >= 80 ? "High Compatibility" : "Moderate Compatibility"}
                  </Badge>
                </div>

                {/* SVG Gauge */}
                <div className="relative my-6 flex items-center justify-center">
                  <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      strokeWidth="8"
                      className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      strokeWidth="8"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * auditResult.overallAtsScore) / 100}
                      strokeLinecap="round"
                      className="stroke-blue-600 dark:stroke-blue-500 fill-none transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      {auditResult.overallAtsScore}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Readiness</span>
                  </div>
                </div>

                <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-semibold">
                  <span>Engine:</span>
                  <span className="text-blue-600 font-bold">{auditResult.engineUsed}</span>
                </div>
              </TiltCard>

              {/* 4 Category Pillar Sub-Scores */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2 card-3d-lift">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-300">Technical Keyword Match</span>
                    <span className="font-black text-blue-600 text-sm">{auditResult.categoryScores.keywordMatch}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${auditResult.categoryScores.keywordMatch}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">Match against required languages and frameworks</p>
                </div>

                <div className="p-5 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2 card-3d-lift">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-300">Quantified Impact & Metrics</span>
                    <span className="font-black text-purple-600 text-sm">{auditResult.categoryScores.quantifiedMetrics}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${auditResult.categoryScores.quantifiedMetrics}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">Percentages, latency numbers, scale figures</p>
                </div>

                <div className="p-5 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2 card-3d-lift">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-300">Action Verb Power</span>
                    <span className="font-black text-emerald-600 text-sm">{auditResult.categoryScores.actionVerbStrength}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${auditResult.categoryScores.actionVerbStrength}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">Architected, engineered, optimized, spearheaded</p>
                </div>

                <div className="p-5 rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-2 card-3d-lift">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-300">Structure & Formatting</span>
                    <span className="font-black text-amber-600 text-sm">{auditResult.categoryScores.formattingReadability}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${auditResult.categoryScores.formattingReadability}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">Clean section headers, contact info, standard ATS layout</p>
                </div>
              </div>
            </div>

            {/* Keyword Overlap & Red Flags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detected vs Missing Skills */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Detected Competencies ({auditResult.detectedSkills.length})</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {auditResult.detectedSkills.map((s) => (
                    <Badge key={s} variant="success" size="md">{s}</Badge>
                  ))}
                </div>

                {auditResult.missingCriticalSkills.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Missing Keywords to Target ({auditResult.missingCriticalSkills.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {auditResult.missingCriticalSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Identified Red Flags & Weaknesses */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>AI-Detected Red Flags & Improvements</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {auditResult.redFlags.map((flag, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recruiter Tailored Summary */}
            <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    AI-Generated Recruiter-Ready Professional Summary
                  </h3>
                </div>
                <button
                  onClick={() => handleCopy(auditResult.tailoredSummary, "summary")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy summary"
                >
                  {copiedKey === "summary" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                "{auditResult.tailoredSummary}"
              </p>
            </div>

            {/* Side-by-Side Bullet Point Enhancements */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>AI Bullet Point Rewrites (Before vs After)</span>
              </h3>

              <div className="space-y-3">
                {auditResult.bulletRewrites.map((rw, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Original Phrasing:</p>
                        <p className="text-slate-500 dark:text-slate-400 line-through">"{rw.original}"</p>
                        <p className="text-[10px] font-bold uppercase text-emerald-600 pt-1">Quantified AI Improvement:</p>
                        <p className="text-slate-900 dark:text-slate-100 font-semibold">• {rw.improved}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(rw.improved, `bullet-${idx}`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-colors shrink-0"
                      >
                        {copiedKey === `bullet-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 pt-1 border-t border-slate-200 dark:border-slate-700 font-medium">
                      💡 Reason: {rw.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI-Generated Interview Prep Questions */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>AI-Predicted Technical Interview Questions for This Resume</span>
              </h3>

              <div className="space-y-3 text-xs">
                {auditResult.customInterviewQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 space-y-2">
                    <p className="font-bold text-purple-900 dark:text-purple-200">
                      Q{idx + 1}: "{q.question}"
                    </p>
                    <p className="text-[11px] text-slate-500">
                      <strong>Why recruiters ask this:</strong> {q.context}
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/50">
                      <strong>Ideal Answer Outline:</strong> {q.idealAnswerOutline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* API Key Modal */}
        <Modal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          title="AI Agent API Key Configuration"
          description="How the AI Resume Agent operates"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
              <p className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Works 100% Out-of-the-Box (No API Key Required)
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                The AI Resume Agent comes with a <strong>built-in autonomous neural heuristic engine</strong> that analyzes skill taxonomies, calculates ATS compatibility, and generates quantified bullet point rewrites instantly without any external API key.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Optional: Enable Google Gemini 1.5 Flash Cloud LLM
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If you would like to connect live cloud LLM generation, simply add your free Google Gemini API key to your <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 font-mono">.env</code> file:
              </p>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
                GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
              </pre>
              <p className="text-[11px] text-slate-500">
                You can get a free Gemini API key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Google AI Studio</a>.
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setIsApiKeyModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
