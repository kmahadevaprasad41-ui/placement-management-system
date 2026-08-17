"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { FileText, Upload, CheckCircle2, Download, Trash2, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { SessionUser } from "@/types";

export default function ResumesPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [resumeTitle, setResumeTitle] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [setAsDefault, setSetAsDefault] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const toast = useToast();

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/students/me");
      if (res.ok) {
        const json = await res.json();
        setResumes(json.student.resumes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResumes();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const res = await fetch("/api/students/me/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resumeTitle || "Software_Engineering_Resume_2026.pdf",
          fileName: fileName || "resume.pdf",
          fileSize: 450000,
          mimeType: "application/pdf",
          setAsDefault,
        }),
      });

      if (res.ok) {
        toast.success("Resume Uploaded", "New resume document has been registered.");
        setIsUploadOpen(false);
        setResumeTitle("");
        setFileName("");
        fetchResumes();
      }
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <AppShell user={currentUser}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Resume Documents
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload and manage tailored resumes for job applications.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsUploadOpen(true)} className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> Upload New Resume
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
          {resumes.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No resumes uploaded yet. Upload a PDF resume to complete your placement profile.
            </div>
          ) : (
            resumes.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{r.title}</p>
                      {r.isDefault && (
                        <Badge variant="success" size="sm" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Default for Applications
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {r.fileName} • {(r.fileSize / 1024).toFixed(0)} KB • Added {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Modal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          title="Upload Resume Document"
          description="Supports PDF format (up to 5MB)."
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resume Title
              </label>
              <input
                type="text"
                required
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="e.g. SDE_FullStack_Resume_v2.pdf"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select File (PDF)
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="resume_2026.pdf"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="def"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="def" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Set as default resume for 1-click applications
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isUploading}>
                Upload Resume
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
