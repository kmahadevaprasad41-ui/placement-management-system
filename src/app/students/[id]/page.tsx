"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
  FileText,
  Briefcase,
  Layers,
  Award,
  ShieldCheck,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { ProfileCompletionWidget } from "@/components/student/profile-completion-widget";
import { SessionUser } from "@/types";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [student, setStudent] = React.useState<any>(null);
  const [profileBreakdown, setProfileBreakdown] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = React.useState(false);
  const [verifyStatus, setVerifyStatus] = React.useState(true);
  const [verifyNotes, setVerifyNotes] = React.useState("");
  const [isSubmittingVerify, setIsSubmittingVerify] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  const fetchStudentData = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch(`/api/students/${studentId}`);
      if (res.ok) {
        const json = await res.json();
        setStudent(json.student);
        setProfileBreakdown(json.profileBreakdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVerify(true);
    try {
      const res = await fetch(`/api/students/${student.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: verifyStatus, verificationNotes: verifyNotes }),
      });
      if (res.ok) {
        toast.success("Verification updated", `Student is now marked as ${verifyStatus ? "Verified" : "Pending"}`);
        setIsVerifyModalOpen(false);
        fetchStudentData();
      }
    } catch (err) {
      toast.error("Failed to update verification");
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  if (isLoading || !student || !currentUser) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 col-span-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  const canVerify = ["PLACEMENT_OFFICER", "SUPER_ADMIN", "DEPARTMENT_COORDINATOR"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="space-y-6">
        {/* Profile Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={student.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${student.user.name}`}
                alt={student.user.name}
                className="w-20 h-20 rounded-2xl bg-slate-100 object-cover border-2 border-slate-200 shrink-0 shadow-sm"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{student.user.name}</h2>
                  {student.isVerified ? (
                    <Badge variant="success" size="sm" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Profile
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Pending Verification
                    </Badge>
                  )}
                  <Badge variant={student.placementStatus === "PLACED" ? "success" : "blue"} size="sm">
                    {student.placementStatus}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Roll No: <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{student.rollNumber}</span> • {student.program.name} ({student.batch.name})
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {student.user.email}</span>
                  {student.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student.phone}</span>}
                  {student.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {student.address}</span>}
                </div>
              </div>
            </div>

            {canVerify && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVerifyModalOpen(true)}
                className="text-xs gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ShieldCheck className="w-4 h-4" /> Verify Credentials
              </Button>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Academics & Readiness */}
          <div className="space-y-6">
            {profileBreakdown && <ProfileCompletionWidget breakdown={profileBreakdown} />}

            {/* Academic Standings Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                Academic Performance
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cumulative GPA (CGPA)</span>
                  <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                    {student.academicRecord?.cgpa ? student.academicRecord.cgpa.toFixed(2) : "0.00"} / 10.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">10th Grade Percentage</span>
                  <span className="font-semibold">{student.academicRecord?.tenthPercentage || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">12th / Diploma Percentage</span>
                  <span className="font-semibold">{student.academicRecord?.twelfthPercentage || student.academicRecord?.diplomaPercentage || "N/A"}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Backlogs</span>
                  <span className={`font-bold ${student.academicRecord?.activeBacklogs === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {student.academicRecord?.activeBacklogs || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Historical Backlogs</span>
                  <span className="font-semibold">{student.academicRecord?.historyBacklogs || 0}</span>
                </div>
              </div>
            </div>

            {/* Resumes */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                Resume Documents
              </h3>
              <div className="space-y-2">
                {student.resumes.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{r.title}</p>
                        <p className="text-[10px] text-slate-400">{(r.fileSize / 1024).toFixed(0)} KB • PDF</p>
                      </div>
                    </div>
                    {r.isDefault && <Badge variant="blue" size="sm">Default</Badge>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills, Projects, Experience, Offers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Technical Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((s: any) => (
                  <div key={s.id} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2">
                    <span>{s.skill.name}</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">
                      {s.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects & Internships */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Projects & Internships</h3>
              <div className="space-y-4">
                {student.projects.map((p: any) => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{p.title}</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{p.description}</p>
                    {p.technologies && (
                      <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-2">
                        Tech: {p.technologies}
                      </p>
                    )}
                  </div>
                ))}

                {student.internships.map((i: any) => (
                  <div key={i.id} className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{i.role} • {i.companyName}</p>
                      {i.stipend && <span className="font-semibold text-emerald-600">{i.stipend}</span>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{i.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Offers */}
            {student.offers.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" /> Placement Offers Released
                </h3>
                <div className="space-y-3">
                  {student.offers.map((o: any) => (
                    <div key={o.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{o.company.name}</p>
                        <p className="text-xs text-slate-500">{o.job.title} • Letter No: {o.offerLetterNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹{o.ctcLPA} LPA</p>
                        <Badge variant={o.status === "ACCEPTED" ? "success" : "purple"} size="sm">
                          {o.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal for Authorities */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify Candidate Profile"
        description="Verify academic records and clearance for campus drives."
      >
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Verification Decision
            </label>
            <select
              value={verifyStatus ? "true" : "false"}
              onChange={(e) => setVerifyStatus(e.target.value === "true")}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
            >
              <option value="true">✓ Verify & Approve Profile</option>
              <option value="false">✕ Reject / Request Correction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Verification Remarks / Audit Notes
            </label>
            <textarea
              rows={3}
              required
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              placeholder="e.g. All academic transcripts, CGPA, and backlog clearance verified against registrar records."
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsVerifyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingVerify}>
              Save Verification
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
