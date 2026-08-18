"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SessionUser } from "@/types";
import {
  Sparkles,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { useToast } from "@/components/ui/toast";

export default function ResumeAIPage() {
  const toast = useToast();
  const [currentUser, setCurrentUser] = React.useState<SessionUser>({
    id: "demo_user",
    email: "student.aarav@institution.edu",
    name: "Aarav Sharma",
    role: "STUDENT",
  });

  const [selectedJob, setSelectedJob] = React.useState("google-swe");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Bullet Enhancer State
  const [draftBullet, setDraftBullet] = React.useState(
    "Built a backend API in Node.js for managing users and reduced server response times."
  );
  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const [enhancedBullets, setEnhancedBullets] = React.useState<string[]>([
    "Architected high-throughput RESTful microservices in Node.js/TypeScript handling 50k+ daily requests, decreasing p99 latency by 38%.",
    "Engineered distributed authentication & caching layer using Redis and Node.js, reducing server response times from 420ms to 180ms.",
    "Spearheaded backend optimization for core user services, implementing connection pooling in PostgreSQL to boost concurrent throughput by 45%.",
  ]);

  const targetJobs = [
    {
      id: "google-swe",
      title: "Google — Software Engineer (Core Systems)",
      role: "SDE 1",
      ctc: "₹32.5 LPA",
      requiredSkills: ["Distributed Systems", "C++", "Java", "Data Structures", "Algorithms", "Concurrency", "System Design", "gRPC", "Docker"],
    },
    {
      id: "msft-idc",
      title: "Microsoft — Software Development Engineer (Azure)",
      role: "SDE 1",
      ctc: "₹28.0 LPA",
      requiredSkills: ["TypeScript", "C#", "Azure", "Cloud Architecture", "REST APIs", "SQL", "Microservices", "CI/CD"],
    },
    {
      id: "amazon-sde",
      title: "Amazon — SDE (AWS Platform)",
      role: "SDE",
      ctc: "₹26.5 LPA",
      requiredSkills: ["Java", "Distributed Databases", "AWS Lambda", "DynamoDB", "Multithreading", "Algorithms", "Object-Oriented Design"],
    },
    {
      id: "infosys-ses",
      title: "Infosys — Digital Specialist Engineer",
      role: "Specialist",
      ctc: "₹9.5 LPA",
      requiredSkills: ["Python", "Java", "Spring Boot", "React", "SQL", "Full Stack", "Problem Solving", "Git"],
    },
  ];

  const currentJobData = targetJobs.find((j) => j.id === selectedJob) || targetJobs[0];

  // Student's Resume Extracted Keywords
  const studentResumeKeywords = [
    "Distributed Systems",
    "Data Structures",
    "Algorithms",
    "C++",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "Redis",
    "Git",
    "Problem Solving",
  ];

  const matchedKeywords = currentJobData.requiredSkills.filter((skill) =>
    studentResumeKeywords.includes(skill)
  );
  const missingKeywords = currentJobData.requiredSkills.filter(
    (skill) => !studentResumeKeywords.includes(skill)
  );

  const matchPercentage = Math.round((matchedKeywords.length / currentJobData.requiredSkills.length) * 100);
  const atsScore = Math.min(100, Math.round(matchPercentage * 0.5 + 46));

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("ATS Analysis Complete", `Resume evaluated against ${currentJobData.title}`);
    }, 600);
  };

  const handleEnhanceBullet = () => {
    const text = draftBullet.trim();
    if (!text) {
      toast.error("Input Required", "Please enter or select a draft bullet point to enhance.");
      return;
    }

    setIsEnhancing(true);
    setTimeout(() => {
      setIsEnhancing(false);
      const lower = text.toLowerCase();
      let variations: string[] = [];

      if (lower.includes("api") || lower.includes("node") || lower.includes("backend") || lower.includes("server")) {
        variations = [
          `Architected high-throughput RESTful microservices and backend infrastructure handling 50,000+ daily requests, decreasing p99 server response latency by 38%.`,
          `Engineered distributed caching & connection pooling layers using Redis and Node.js, reducing server response times from 420ms to 160ms (62% performance boost).`,
          `Spearheaded modular backend service architecture, implementing JWT authentication and rate limiting to support 5,000+ concurrent active sessions with 99.99% uptime.`,
        ];
      } else if (lower.includes("react") || lower.includes("frontend") || lower.includes("ui") || lower.includes("css")) {
        variations = [
          `Engineered high-performance responsive web interfaces in React/TypeScript, reducing First Contentful Paint (FCP) by 45% and boosting Lighthouse performance score to 98/100.`,
          `Architected modular, reusable UI design system component library, accelerating feature development velocity by 30% across cross-functional engineering teams.`,
          `Implemented client-side state management and optimistic UI updates, decreasing perceived page load latency by 40% for 10,000+ monthly active users.`,
        ];
      } else if (lower.includes("database") || lower.includes("sql") || lower.includes("postgres") || lower.includes("data")) {
        variations = [
          `Optimized complex multi-table SQL queries and database index structures, reducing execution bottlenecks from 650ms to 120ms (81% query speedup).`,
          `Architected scalable relational schemas with PostgreSQL connection pooling, handling 15,000+ transactions/sec while maintaining ACID compliance.`,
          `Automated database replication and continuous backup pipelines, ensuring zero data loss and achieving 99.99% high availability.`,
        ];
      } else if (lower.includes("ml") || lower.includes("ai") || lower.includes("model") || lower.includes("python")) {
        variations = [
          `Trained and fine-tuned predictive machine learning pipelines in Python/PyTorch, boosting model classification accuracy to 94.8% on cross-validation benchmarks.`,
          `Deployed containerized AI inference microservices with Docker and FastAPI, cutting end-to-end model prediction latency by 55%.`,
          `Automated end-to-end feature extraction and data preprocessing workflows, reducing manual pipeline processing time by 15+ engineering hours per week.`,
        ];
      } else {
        variations = [
          `Spearheaded ${text.replace(/\.$/, "")}, decreasing processing overhead by 40% and cutting deployment turnaround time from 3 days to 4 hours.`,
          `Engineered scalable automated workflows for ${text.replace(/\.$/, "")}, achieving 99.9% reliability and driving measurable operational efficiency gains.`,
          `Architected high-impact technical solution around ${text.replace(/\.$/, "")}, enhancing throughput by 35% across production workloads.`,
        ];
      }

      setEnhancedBullets(variations);
      toast.success("AI Enhancements Generated", "3 quantified, metric-driven bullet points created!");
    }, 500);
  };

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to Clipboard", "Bullet point copied to clipboard.");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AppShell user={currentUser}>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "5s" }} />
                <span>AI-Powered Career Intelligence Suite</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                AI Resume Analyzer & ATS Matcher
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Scan your resume against live campus hiring job descriptions, identify critical keyword gaps, view real-time ATS compatibility scores, and generate quantified bullet points.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="3d-emerald"
                size="md"
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                className="gap-2 text-xs font-bold"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Run Instant ATS Scan</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Target Job Selector Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Benchmark Against Target Job</p>
                <p className="text-[11px] text-slate-500">Select an active campus recruitment opening to compute keyword overlap</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {targetJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedJob === job.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {job.title.split("—")[0].trim()} ({job.ctc})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ATS Score & Keyword Gap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circular ATS Gauge */}
          <TiltCard className="p-6 flex flex-col items-center justify-between text-center">
            <div className="w-full text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Compatibility</span>
                <Badge variant={atsScore >= 80 ? "emerald" : "amber"} size="sm">
                  {atsScore >= 80 ? "High Match" : "Moderate Match"}
                </Badge>
              </div>
            </div>

            {/* Circular Progress Gauge */}
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
                  strokeDashoffset={264 - (264 * atsScore) / 100}
                  strokeLinecap="round"
                  className="stroke-blue-600 dark:stroke-blue-500 fill-none transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{atsScore}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
              </div>
            </div>

            {/* Audit Checklist Summary */}
            <div className="w-full space-y-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Technical Keywords</span>
                <span className="font-bold">{matchPercentage}% Match</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Standard PDF Formatting</span>
                <span className="font-bold text-emerald-600">Passed</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Quantified Metrics Density</span>
                <span className="font-bold text-blue-600">8 Metrics</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Action Verbs Usage</span>
                <span className="font-bold text-purple-600">High (14)</span>
              </div>
            </div>
          </TiltCard>

          {/* Keyword Matcher & Gap Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Keyword Overlap & Gap Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comparing your profile against {currentJobData.title}
                  </p>
                </div>
                <Badge variant="blue" size="sm">
                  {matchedKeywords.length} of {currentJobData.requiredSkills.length} Matched
                </Badge>
              </div>

              {/* Matched Keywords */}
              <div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4" /> Detected in Your Resume ({matchedKeywords.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              {missingKeywords.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-2.5">
                    <AlertCircle className="w-4 h-4" /> Missing Keywords to Add ({missingKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300 flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    💡 Tip: Incorporate these missing skills into your projects and resume summary to push your ATS compatibility past 90%.
                  </p>
                </div>
              )}
            </div>

            {/* AI Resume Bullet Enhancer Tool */}
            <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/40 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      AI Resume Bullet Point Enhancer
                    </h3>
                    <p className="text-[11px] text-slate-500">Transform passive duty statements into high-impact metric achievements</p>
                  </div>
                </div>
                <Button
                  variant="3d-primary"
                  size="sm"
                  onClick={handleEnhanceBullet}
                  isLoading={isEnhancing}
                  className="text-xs gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Enhance with AI</span>
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Your Draft Bullet Point
                  </label>
                  <span className="text-[10px] text-slate-400">Click a preset or type custom text:</span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {[
                    "Built a backend API in Node.js for managing users and reduced server response times.",
                    "Created responsive user interface using React and TailwindCSS with dark mode.",
                    "Optimized SQL queries and database indexes to speed up transaction processing.",
                    "Trained machine learning classification model in Python to predict student placements.",
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        setDraftBullet(preset);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-purple-950/60 dark:hover:text-purple-300 transition-colors"
                    >
                      {preset.split(" ").slice(0, 4).join(" ")}...
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={draftBullet}
                  onChange={(e) => setDraftBullet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  placeholder="Paste any bullet point from your resume here..."
                />
              </div>

              {/* AI Suggested Variations */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                  AI-Generated Metric-Driven Variations
                </p>
                <div className="space-y-2">
                  {enhancedBullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm hover:border-purple-300 transition-all flex items-start justify-between gap-3 group"
                    >
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed flex-1">
                        • {bullet}
                      </p>
                      <button
                        onClick={() => handleCopyBullet(bullet, idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                        title="Copy bullet"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
