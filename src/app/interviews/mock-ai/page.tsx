"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SessionUser } from "@/types";
import {
  Sparkles,
  Video,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  Clock,
  Send,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { useToast } from "@/components/ui/toast";

export default function MockInterviewAIPage() {
  const toast = useToast();
  const [currentUser] = React.useState<SessionUser>({
    id: "demo_user",
    email: "student.aarav@institution.edu",
    name: "Aarav Sharma",
    role: "STUDENT",
  });

  const [selectedTrack, setSelectedTrack] = React.useState("google-swe");
  const [sessionActive, setSessionActive] = React.useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [answerText, setAnswerText] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [timerSeconds, setTimerSeconds] = React.useState(180);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [showScorecard, setShowScorecard] = React.useState(false);

  const interviewTracks = [
    {
      id: "google-swe",
      company: "Google",
      trackName: "Distributed Systems & Algorithms",
      difficulty: "Hard",
      timePerQuestion: 180,
      questions: [
        {
          q: "How would you design a distributed rate limiter that handles 100k requests per second across multi-region server clusters?",
          hint: "Think about Token Bucket / Leaky Bucket algorithms, Redis with Lua scripts, or local in-memory sliding windows with gossip synchronization.",
          category: "System Design & Distributed Systems",
        },
        {
          q: "Explain how you would detect a cycle in a directed graph representing package dependencies, and return the valid build order.",
          hint: "Discuss Kahn's algorithm (BFS with in-degrees) or DFS with 3-color state marking (White/Gray/Black).",
          category: "Algorithms & Graph Theory",
        },
        {
          q: "Describe a scenario where optimistic concurrency control is superior to pessimistic locking in high-throughput database systems.",
          hint: "Contrast read-heavy vs write-heavy workloads, version timestamps, and retry mechanisms.",
          category: "Database Engineering & Concurrency",
        },
      ],
    },
    {
      id: "amazon-bar-raiser",
      company: "Amazon",
      trackName: "Leadership Principles & High-Scale Systems",
      difficulty: "Medium-Hard",
      timePerQuestion: 180,
      questions: [
        {
          q: "Tell me about a time you had to make a high-stakes technical decision with incomplete data. How did you handle bias for action and customer obsession?",
          hint: "Structure using the STAR framework: Situation, Task, Action, and measurable Results with quantifiable metrics.",
          category: "Behavioral & Leadership",
        },
        {
          q: "How would you design the backend for Amazon Flash Sale / Lightning Deals to prevent overselling while maintaining sub-50ms latency?",
          hint: "Mention distributed caches (Redis/DAX), atomic decrements, asynchronous queue processing (SQS/Kafka), and inventory reservation states.",
          category: "High-Throughput Architecture",
        },
      ],
    },
    {
      id: "microsoft-azure",
      company: "Microsoft",
      trackName: "Cloud Architecture & OOP Systems",
      difficulty: "Medium",
      timePerQuestion: 180,
      questions: [
        {
          q: "Explain how you would design a multi-tenant microservices architecture ensuring complete data isolation and zero cross-tenant contamination.",
          hint: "Discuss database-per-tenant vs schema-per-tenant, JWT tenant claims, row-level security, and API gateway tenant routing.",
          category: "Cloud Security & Architecture",
        },
        {
          q: "What are the SOLID design principles, and how do they apply when refactoring legacy monolithic codebases into extensible services?",
          hint: "Provide concrete examples for Single Responsibility and Dependency Inversion using interfaces or dependency injection containers.",
          category: "Object-Oriented Design",
        },
      ],
    },
  ];

  const currentTrackData = interviewTracks.find((t) => t.id === selectedTrack) || interviewTracks[0];
  const currentQuestion = currentTrackData.questions[currentQuestionIdx] || currentTrackData.questions[0];

  // Timer countdown when session active
  React.useEffect(() => {
    let interval: any;
    if (sessionActive && timerSeconds > 0 && !showScorecard) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, timerSeconds, showScorecard]);

  const handleStartSession = () => {
    setSessionActive(true);
    setCurrentQuestionIdx(0);
    setTimerSeconds(currentTrackData.timePerQuestion);
    setAnswerText("");
    setShowScorecard(false);
    toast.success("AI Mock Interview Started", `Track: ${currentTrackData.company} — ${currentTrackData.trackName}`);
  };

  const handleNextQuestion = () => {
    if (!answerText.trim()) {
      toast.error("Answer Required", "Please type or speak your answer before submitting.");
      return;
    }

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      if (currentQuestionIdx < currentTrackData.questions.length - 1) {
        setCurrentQuestionIdx((prev) => prev + 1);
        setTimerSeconds(currentTrackData.timePerQuestion);
        setAnswerText("");
        toast.success("Response Recorded", "Moving to next interview question.");
      } else {
        setShowScorecard(true);
        toast.success("Interview Complete", "AI Performance Scorecard generated!");
      }
    }, 800);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("Voice Recording Active", "Speak clearly into your microphone. Transcribing...");
      // Simulate live voice transcription
      setAnswerText((prev) =>
        prev
          ? `${prev} To design this distributed system, we should establish an in-memory Redis cluster utilizing consistent hashing...`
          : "To solve this problem, I would first clarify the throughput constraints and latency SLA. For high availability across regions, we can implement an asynchronous event pipeline with Redis caching..."
      );
    } else {
      toast.success("Recording Paused", "Voice input captured.");
    }
  };

  return (
    <AppShell user={currentUser}>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-purple-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span>Real-Time AI Interview Simulator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                AI Technical & Behavioral Mock Interview Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Practice realistic company-specific interview tracks with our intelligent AI interviewer. Get real-time audio wave feedback, timer pacing, and comprehensive scoring on technical accuracy and STAR framework communication.
              </p>
            </div>

            {!sessionActive && (
              <Button
                variant="3d-primary"
                size="lg"
                onClick={handleStartSession}
                className="gap-2 font-bold shadow-xl shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start AI Mock Interview</span>
              </Button>
            )}
          </div>
        </div>

        {/* Track Selection (When not active) */}
        {!sessionActive && !showScorecard && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Select Company Track & Role Simulation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {interviewTracks.map((track) => (
                <TiltCard
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`p-6 cursor-pointer border-2 transition-all ${
                    selectedTrack === track.id
                      ? "border-purple-600 bg-purple-50/20 dark:bg-purple-950/20 shadow-lg"
                      : "border-slate-200 dark:border-slate-800 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">{track.company}</span>
                    <Badge variant={track.difficulty === "Hard" ? "rose" : "purple"} size="sm">
                      {track.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">{track.trackName}</p>
                  <p className="text-xs text-slate-500 mb-4">{track.questions.length} Scenario Questions • 3 Mins / Question</p>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>AI Evaluated</span>
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      <span>Select Track</span> <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        {/* Live Active Interview Room */}
        {sessionActive && !showScorecard && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left AI Interviewer Persona Panel */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center justify-between text-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="uppercase">{currentTrackData.company} AI Interviewer</span>
                <span className="text-purple-600 font-mono">Q{currentQuestionIdx + 1} / {currentTrackData.questions.length}</span>
              </div>

              {/* Pulsing AI Persona Orb with Audio Waves */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-2xl shadow-purple-500/40 animate-pulse-glow">
                  <BrainCircuit className="w-14 h-14 animate-pulse" />
                </div>
                {/* Simulated Sound Wave Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping" style={{ animationDuration: "3s" }} />
                <div className="absolute -inset-3 rounded-full border border-indigo-400/20 animate-pulse" />
              </div>

              <div className="space-y-1">
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Senior Engineering Interviewer
                </p>
                <p className="text-xs text-slate-500">
                  {currentTrackData.company} Talent Assessment Model
                </p>
              </div>

              {/* Timer Pill */}
              <div className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Clock className={`w-4 h-4 ${timerSeconds < 30 ? "text-rose-500 animate-bounce" : "text-blue-600"}`} />
                <span className={`font-mono text-sm font-black ${timerSeconds < 30 ? "text-rose-600" : "text-slate-900 dark:text-slate-100"}`}>
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")} remaining
                </span>
              </div>
            </div>

            {/* Right Question & Answer Terminal */}
            <div className="lg:col-span-2 space-y-5">
              {/* Question Card */}
              <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50/40 via-white to-indigo-50/30 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm">
                    {currentQuestion.category}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-semibold">Stage: Technical Evaluation</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                  "{currentQuestion.q}"
                </h3>
                <div className="p-3 rounded-xl bg-purple-100/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
                  <span><strong>AI Hint:</strong> {currentQuestion.hint}</span>
                </div>
              </div>

              {/* Answer Input Area */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Solution / Verbal & Technical Articulation
                  </label>
                  <button
                    onClick={toggleRecording}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      isRecording
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? "Recording Live..." : "Voice Input (Speech-to-Text)"}</span>
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                  placeholder="Articulate your thought process clearly. Walk through edge cases, time/space complexity, data structures, and architectural trade-offs..."
                />

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSessionActive(false)}
                    className="text-xs"
                  >
                    End Session Early
                  </Button>

                  <Button
                    variant="3d-primary"
                    size="md"
                    onClick={handleNextQuestion}
                    isLoading={isEvaluating}
                    className="gap-2 font-bold text-xs"
                  >
                    <span>{currentQuestionIdx < currentTrackData.questions.length - 1 ? "Submit & Next Question" : "Submit Final Answer"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Performance Scorecard Result */}
        {showScorecard && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <Badge variant="purple" size="md" className="mb-2">AI Scorecard Report</Badge>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {currentTrackData.company} Mock Interview Assessment
                </h2>
                <p className="text-xs text-slate-500">Candidate: {currentUser.name} • Track: {currentTrackData.trackName}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">8.8 / 10</p>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Strong Hire Benchmark</p>
                </div>
              </div>
            </div>

            {/* Scorecard Breakdown Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-xs font-bold text-slate-500">Technical Depth</p>
                <p className="text-xl font-black text-blue-600">9.2 / 10</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Exceptional grasp of Redis sliding window & distributed consistency trade-offs.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-xs font-bold text-slate-500">Problem Solving & Architecture</p>
                <p className="text-xl font-black text-purple-600">8.6 / 10</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Clean breakdown of bottleneck points and throughput scaling models.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="text-xs font-bold text-slate-500">Communication & Clarity</p>
                <p className="text-xl font-black text-emerald-600">8.7 / 10</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Structured thoughts logically; addressed SLA expectations proactively.</p>
              </div>
            </div>

            {/* Strengths & Improvement Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Demonstrated Key Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
                    • Articulated p99 latency degradation risks under spike loads.
                  </li>
                  <li className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
                    • Demonstrated deep understanding of Lua scripting for atomic rate limiting.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Suggested Areas to Polish
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900">
                    • State specific numeric cache eviction policies (e.g. `volatile-lru`).
                  </li>
                  <li className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900">
                    • Mention disaster recovery fallback strategies when Redis primary nodes fail.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="3d-primary"
                size="md"
                onClick={handleStartSession}
                className="gap-1.5 font-bold text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Another Session</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
