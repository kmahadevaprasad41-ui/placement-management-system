"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Video, Plus, Clock, Users, ExternalLink, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function DrivesPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [drives, setDrives] = React.useState<any[]>([]);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [jobId, setJobId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [driveDate, setDriveDate] = React.useState("2026-09-15");
  const [venue, setVenue] = React.useState("Main Placement Auditorium");
  const [isOnline, setIsOnline] = React.useState(false);
  const [meetLink, setMeetLink] = React.useState("");
  const [stages, setStages] = React.useState("Coding Assessment, Technical Interview, HR Discussion");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

  const fetchDrives = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const [drivesRes, jobsRes] = await Promise.all([
        fetch("/api/drives"),
        fetch("/api/jobs"),
      ]);

      if (drivesRes.ok) {
        const json = await drivesRes.json();
        setDrives(json.drives);
      }
      if (jobsRes.ok) {
        const jobsJson = await jobsRes.json();
        setJobs(jobsJson.jobs);
        if (jobsJson.jobs.length > 0 && !jobId) {
          setJobId(jobsJson.jobs[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDrives();
  }, []);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          title,
          driveDate,
          venue,
          isOnline,
          meetLink: isOnline ? meetLink : undefined,
          stages,
        }),
      });

      if (res.ok) {
        toast.success("Drive Scheduled", `${title} has been scheduled.`);
        setIsCreateOpen(false);
        fetchDrives();
      }
    } catch (e) {
      toast.error("Failed to schedule drive");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const canCreate = ["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Placement Drives & Campus Events
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scheduled company hiring drives, online assessments, and interview round sequences.
            </p>
          </div>

          {canCreate && (
            <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Schedule Drive
            </Button>
          )}
        </div>

        {/* Drives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drives.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      {d.company.logoUrl ? (
                        <img src={d.company.logoUrl} alt={d.company.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="font-extrabold text-sm">{d.company.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{d.title}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{d.company.name} • {d.job.title}</p>
                    </div>
                  </div>

                  <Badge variant={d.status === "ONGOING" ? "warning" : "purple"} size="sm">
                    {d.status}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold">{new Date(d.driveDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    {d.isOnline ? (
                      <Video className="w-4 h-4 text-purple-600 shrink-0" />
                    ) : (
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span>{d.venue}</span>
                  </p>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Recruitment Stages:</p>
                  <p className="text-slate-500 mt-0.5">{d.stages}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  ₹{d.job.ctcLPA} LPA Package
                </span>

                {d.meetLink && (
                  <a
                    href={d.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Join Session</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Drive Modal */}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Schedule Placement Drive"
          description="Announce a new campus hiring event with scheduled stages."
        >
          <form onSubmit={handleCreateDrive} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Associated Job Opening
              </label>
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.company.name} — {j.title} (₹{j.ctcLPA} LPA)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Drive Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Amazon AWS Campus Hiring Drive"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Drive Date
                </label>
                <input
                  type="date"
                  required
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Main Auditorium"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recruitment Stages
              </label>
              <input
                type="text"
                value={stages}
                onChange={(e) => setStages(e.target.value)}
                placeholder="Coding Test, Technical Round 1, HR"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Schedule Event
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
