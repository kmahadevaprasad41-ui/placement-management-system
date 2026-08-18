"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SessionUser } from "@/types";
import {
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/ui/tilt-card";
import { useToast } from "@/components/ui/toast";

export default function DriveRadarPage() {
  const toast = useToast();
  const [currentUser] = React.useState<SessionUser>({
    id: "demo_user",
    email: "student.aarav@institution.edu",
    name: "Aarav Sharma",
    role: "STUDENT",
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = React.useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const drives = [
    {
      id: "google-drive-1",
      company: "Google",
      title: "Google University Graduate Campus Drive 2026",
      ctc: "₹32.5 LPA",
      date: "Scheduled in 4 Days",
      venue: "Central Auditorium / Google Meet",
      isOnline: true,
      registeredCount: 48,
      status: "UPCOMING",
      stages: [
        { name: "Online Challenge", status: "PENDING", date: "Aug 22, 10:00 AM" },
        { name: "Technical Round 1", status: "PENDING", date: "Aug 23, 02:00 PM" },
        { name: "Systems & Leadership", status: "PENDING", date: "Aug 24, 11:00 AM" },
        { name: "Offer Letters", status: "PENDING", date: "Aug 25, 05:00 PM" },
      ],
    },
    {
      id: "infosys-drive-2",
      company: "Infosys",
      title: "Digital Specialist Engineer Recruitment Drive",
      ctc: "₹9.5 LPA",
      date: "Live Ongoing Now",
      venue: "Central Computing Center, Block A",
      isOnline: false,
      registeredCount: 92,
      status: "LIVE_NOW",
      stages: [
        { name: "InfyTQ Coding Test", status: "COMPLETED", date: "Completed" },
        { name: "Technical Interview", status: "IN_PROGRESS", date: "Live Round 2" },
        { name: "HR Discussion", status: "UPCOMING", date: "Today 04:00 PM" },
        { name: "Offer Declaration", status: "PENDING", date: "Today 07:00 PM" },
      ],
    },
    {
      id: "ltts-drive-3",
      company: "L&T Technology Services",
      title: "Graduate Engineer Trainee (GET) Drive",
      ctc: "₹8.5 LPA",
      date: "Scheduled in 11 Days",
      venue: "Main Seminar Hall",
      isOnline: false,
      registeredCount: 65,
      status: "UPCOMING",
      stages: [
        { name: "Written Technical Test", status: "PENDING", date: "Aug 29, 09:30 AM" },
        { name: "Embedded Systems Panel", status: "PENDING", date: "Aug 29, 02:00 PM" },
        { name: "HR Interview", status: "PENDING", date: "Aug 30, 11:00 AM" },
      ],
    },
  ];

  const handleDownloadCalendar = (driveTitle: string) => {
    toast.success("Calendar Event Generated", `Added "${driveTitle}" to your calendar.`);
  };

  return (
    <AppShell user={currentUser}>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Live Radar Banner with Countdown */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-blue-800/40">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Live Campus Hiring Radar & Stepper</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Placement Drive Radar & Pipeline Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Real-time tracking of active campus recruitment drives, stage-by-stage pipeline progress, countdown clocks, and instant virtual meeting launchers.
              </p>
            </div>

            {/* Live Ticking Countdown Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                Next Flagship Drive: Google SWE 2026
              </p>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2 rounded-xl bg-black/40 min-w-[54px]">
                  <p className="text-xl sm:text-2xl font-black text-white">{timeLeft.days}</p>
                  <p className="text-[9px] uppercase text-slate-400">Days</p>
                </div>
                <div className="p-2 rounded-xl bg-black/40 min-w-[54px]">
                  <p className="text-xl sm:text-2xl font-black text-white">{timeLeft.hours}</p>
                  <p className="text-[9px] uppercase text-slate-400">Hours</p>
                </div>
                <div className="p-2 rounded-xl bg-black/40 min-w-[54px]">
                  <p className="text-xl sm:text-2xl font-black text-white">{timeLeft.minutes}</p>
                  <p className="text-[9px] uppercase text-slate-400">Mins</p>
                </div>
                <div className="p-2 rounded-xl bg-black/40 min-w-[54px]">
                  <p className="text-xl sm:text-2xl font-black text-rose-400 animate-pulse">{timeLeft.seconds}</p>
                  <p className="text-[9px] uppercase text-slate-400">Secs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drives Stepper Cards */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Active & Upcoming Drive Progression
          </h2>

          <div className="space-y-5">
            {drives.map((drive) => (
              <div
                key={drive.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5 card-3d-lift"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {drive.title}
                        </h3>
                        {drive.status === "LIVE_NOW" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> LIVE NOW
                          </span>
                        ) : (
                          <Badge variant="blue" size="sm">Scheduled</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {drive.venue}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {drive.registeredCount} Eligible Registered</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="emerald" size="md" className="font-black">{drive.ctc}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadCalendar(drive.title)}
                      className="text-xs gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Sync Calendar</span>
                    </Button>
                  </div>
                </div>

                {/* Stage Progression Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {drive.stages.map((stage, sIdx) => {
                    const isCompleted = stage.status === "COMPLETED";
                    const isInProgress = stage.status === "IN_PROGRESS";

                    return (
                      <div
                        key={sIdx}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isCompleted
                            ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900"
                            : isInProgress
                            ? "bg-blue-50/60 border-blue-300 dark:bg-blue-950/40 dark:border-blue-800 shadow-sm animate-pulse-glow"
                            : "bg-slate-50 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Stage {sIdx + 1}
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isInProgress ? (
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{stage.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{stage.date}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
