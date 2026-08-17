"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Sparkles, Award, Video, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-14 z-50 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {isLoading ? "Loading notifications..." : "You're all caught up!"}
          </div>
        ) : (
          notifications.map((n) => {
            const icons = {
              OFFER: <Award className="w-4 h-4 text-emerald-500 shrink-0" />,
              INTERVIEW: <Video className="w-4 h-4 text-blue-500 shrink-0" />,
              WARNING: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
              INFO: <Info className="w-4 h-4 text-slate-400 shrink-0" />,
            };

            return (
              <div
                key={n.id}
                className={cn(
                  "p-3 rounded-lg flex items-start gap-2.5 transition-colors",
                  !n.isRead ? "bg-blue-50/50 dark:bg-blue-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                )}
              >
                {icons[n.type as keyof typeof icons] || icons.INFO}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                    {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => {
                        markAsRead(n.id);
                        onClose();
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1 inline-block"
                    >
                      View details $\to$
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
