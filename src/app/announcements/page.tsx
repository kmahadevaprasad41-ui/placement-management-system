"use client";

import * as React from "react";
import { Megaphone, Plus, Calendar, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { SessionUser } from "@/types";

export default function AnnouncementsPage() {
  const [currentUser, setCurrentUser] = React.useState<SessionUser | null>(null);
  const [announcements, setAnnouncements] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [priority, setPriority] = React.useState("NORMAL");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/announcements");
      if (res.ok) {
        const json = await res.json();
        setAnnouncements(json.announcements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, priority }),
      });

      if (res.ok) {
        toast.success("Announcement Broadcasted", "Campus notice has been published.");
        setIsAddOpen(false);
        setTitle("");
        setContent("");
        fetchAnnouncements();
      }
    } catch (e) {
      toast.error("Failed to publish announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const canPublish = ["PLACEMENT_OFFICER", "SUPER_ADMIN"].includes(currentUser.role);

  return (
    <AppShell user={currentUser}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Campus Placement Announcements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official notifications, assessment deadlines, and pre-placement talk broadcasts.
            </p>
          </div>

          {canPublish && (
            <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Broadcast Notice
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {announcements.map((a) => {
            const isUrgent = a.priority === "URGENT";
            const isImportant = a.priority === "IMPORTANT";

            return (
              <div
                key={a.id}
                className={`rounded-2xl border p-6 shadow-sm transition-all bg-white dark:bg-slate-900 ${
                  isUrgent
                    ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/20"
                    : isImportant
                    ? "border-amber-300 dark:border-amber-900/60"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isUrgent ? "destructive" : isImportant ? "warning" : "blue"}
                      size="sm"
                    >
                      {a.priority}
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{a.title}</h3>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed whitespace-pre-line">
                  {a.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Create Modal */}
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Broadcast Campus Notice"
          description="Send an official placement notice to registered students."
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notice Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800 font-bold"
              >
                <option value="NORMAL">Normal Information</option>
                <option value="IMPORTANT">Important Notice</option>
                <option value="URGENT">⚠️ Urgent Deadline Action Required</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Assessment Slot Confirmation for CSE/IT"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notice Content
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide detailed instructions, time limits, and venue requirements..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Publish Notice
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
