"use client";

import * as React from "react";
import { Video, Calendar, Clock, Plus, AlertTriangle, CheckCircle2, ShieldCheck, User, Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function InterviewsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [interviews, setInterviews] = React.useState<any[]>([]);
  const [students, setStudents] = React.useState<any[]>([]);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Schedule modal state
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);
  const [selectedStudentId, setSelectedStudentId] = React.useState("");
  const [selectedJobId, setSelectedJobId] = React.useState("");
  const [roundName, setRoundName] = React.useState("Technical Round 1");
  const [interviewerName, setInterviewerName] = React.useState("Senior Engineering Lead");
  const [scheduledStart, setScheduledStart] = React.useState("2026-09-20T10:00");
  const [scheduledEnd, setScheduledEnd] = React.useState("2026-09-20T10:45");
  const [venue, setVenue] = React.useState("Virtual Google Meet");
  const [isScheduling, setIsScheduling] = React.useState(false);
  const [conflictWarning, setConflictWarning] = React.useState<any | null>(null);

  // Feedback modal state
  const [feedbackInterview, setFeedbackInterview] = React.useState<any | null>(null);
  const [techRating, setTechRating] = React.useState("4");
  const [commRating, setCommRating] = React.useState("4");
  const [overallScore, setOverallScore] = React.useState("8.5");
  const [recommendation, setRecommendation] = React.useState("SELECT");
  const [strengths, setStrengths] = React.useState("");
  const [remarks, setRemarks] = React.useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false);

  const toast = useToast();

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const [ivRes, studRes, jobsRes] = await Promise.all([
        fetch("/api/interviews"),
        fetch("/api/students"),
        fetch("/api/jobs"),
      ]);

      if (ivRes.ok) {
        const json = await ivRes.json();
        setInterviews(json.interviews);
      }
      if (studRes.ok) {
        const studJson = await studRes.json();
        setStudents(studJson.students);
        if (studJson.students.length > 0 && !selectedStudentId) {
          setSelectedStudentId(studJson.students[0].id);
        }
      }
      if (jobsRes.ok) {
        const jobsJson = await jobsRes.json();
        setJobs(jobsJson.jobs);
        if (jobsJson.jobs.length > 0 && !selectedJobId) {
          setSelectedJobId(jobsJson.jobs[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInterviews();
  }, []);

  const handleScheduleSubmit = async (ignoreConflict = false) => {
    setIsScheduling(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          jobId: selectedJobId,
          roundName,
          interviewerName,
          scheduledStart,
          scheduledEnd,
          venue,
          ignoreConflict,
        }),
      });

      const data = await res.json();
      if (res.status === 409) {
        // Scheduling Conflict detected by Conflict Detector Engine!
        setConflictWarning(data.conflictDetails);
        toast.warning("Scheduling Conflict Detected", data.error);
        return;
      }

      if (res.ok) {
        toast.success("Interview Scheduled", "Candidate has been notified with the slot details.");
        setIsScheduleOpen(false);
        setConflictWarning(null);
        fetchInterviews();
      } else {
        toast.error("Scheduling failed", data.error);
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInterview) return;
    setIsSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/interviews/${feedbackInterview.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicalRating: techRating,
          communicationRating: commRating,
          overallScore,
          recommendation,
          strengths,
          remarks,
        }),
      });

      if (res.ok) {
        toast.success("Feedback Recorded", "Scorecard saved and candidate stage updated.");
        setFeedbackInterview(null);
        fetchInterviews();
      }
    } catch (e) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const canSchedule = ["PLACEMENT_OFFICER", "SUPER_ADMIN", "RECRUITER"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Interview Management & Evaluation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-round technical assessments, conflict-aware scheduling, and scorecard reviews.
            </p>
          </div>

          {canSchedule && (
            <Button variant="primary" size="sm" onClick={() => setIsScheduleOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Schedule Interview
            </Button>
          )}
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          {interviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
              No interview sessions scheduled currently.
            </div>
          ) : (
            interviews.map((iv) => (
              <div
                key={iv.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={iv.student.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${iv.student.user.name}`}
                    alt={iv.student.user.name}
                    className="w-12 h-12 rounded-2xl bg-slate-100 object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{iv.student.user.name}</h3>
                      <Badge variant="secondary" size="sm">{iv.student.rollNumber}</Badge>
                      <Badge variant={iv.status === "COMPLETED" ? "success" : "purple"} size="sm">
                        {iv.status}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      {iv.job.company.name} • <span className="text-blue-600">{iv.roundName}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(iv.scheduledStart).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(iv.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(iv.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Interviewer: {iv.interviewerName}
                      </span>
                    </div>

                    {/* Feedbacks summary if available */}
                    {iv.feedbacks.length > 0 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                        <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        <span className="font-bold">Evaluation Score: {iv.feedbacks[0].overallScore}/10</span>
                        <span>• Recommendation: <strong>{iv.feedbacks[0].recommendation}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {canSchedule && iv.status !== "COMPLETED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFeedbackInterview(iv)}
                      className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Submit Feedback
                    </Button>
                  )}
                  {iv.meetLink && (
                    <a href={iv.meetLink} target="_blank" rel="noreferrer">
                      <Button variant="primary" size="sm" className="text-xs gap-1.5">
                        <Video className="w-3.5 h-3.5" /> Join Room
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Schedule Interview Modal */}
        <Modal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setConflictWarning(null);
          }}
          title="Schedule Candidate Interview"
          description="Integrated with the Interview Conflict Detection Engine to prevent double booking."
        >
          <div className="space-y-4">
            {conflictWarning && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Conflict Warning: Overlapping Time Slot</span>
                </div>
                <p>
                  This student is already booked for <strong>{conflictWarning.title}</strong> from {conflictWarning.scheduledStart} to {conflictWarning.scheduledEnd}.
                </p>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleScheduleSubmit(true)}
                  >
                    Force Schedule Overlap
                  </Button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Candidate
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.user.name} ({s.rollNumber} - {s.department.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company & Role
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.company.name} — {j.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Round Title
                </label>
                <input
                  type="text"
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  placeholder="Technical Round 1"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interviewer Name
                </label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  placeholder="Staff Engineer"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Slot Start Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledStart}
                  onChange={(e) => setScheduledStart(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Slot End Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledEnd}
                  onChange={(e) => setScheduledEnd(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsScheduleOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={isScheduling}
                onClick={() => handleScheduleSubmit(false)}
              >
                Schedule & Check Conflicts
              </Button>
            </div>
          </div>
        </Modal>

        {/* Feedback Modal */}
        {feedbackInterview && (
          <Modal
            isOpen={Boolean(feedbackInterview)}
            onClose={() => setFeedbackInterview(null)}
            title={`Interview Evaluation: ${feedbackInterview.student.user.name}`}
            description={`Record technical ratings and recommendation for ${feedbackInterview.roundName}.`}
          >
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Technical (1-5)
                  </label>
                  <select
                    value={techRating}
                    onChange={(e) => setTechRating(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Weak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Communication
                  </label>
                  <select
                    value={commRating}
                    onChange={(e) => setCommRating(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Clear & Articulate</option>
                    <option value="3">3 - Moderate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Overall Score (/10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={overallScore}
                    onChange={(e) => setOverallScore(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Final Recommendation
                </label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="SELECT">✓ Select Candidate (Move to Selected)</option>
                  <option value="ADVANCE">Advance to Next Round</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="REJECT">✕ Reject Candidate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Candidate Strengths & Core Takeaways
                </label>
                <textarea
                  rows={3}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g. Strong understanding of distributed hash tables and clean system design."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setFeedbackInterview(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingFeedback}>
                  Save Scorecard
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}
