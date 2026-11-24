"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  X,
  TrendingDown,
  Clock,
  Zap,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { type AppNotification, getNotifications, markNotificationAsRead } from "@/lib/notifications";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAutopilot?: () => void;
}

export function NotificationDrawer({ isOpen, onClose, onOpenAutopilot }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadNotifs();
    }
  }, [isOpen]);

  const loadNotifs = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch {
      setNotifications(getNotifications());
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_read", id }),
      });
    } catch {
      markNotificationAsRead(id);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#FBF7EA] border-l-2 border-[#1B1A17] shadow-2xl p-6 flex flex-col justify-between font-mono animate-in slide-in-from-right duration-300">
      <div className="space-y-4 overflow-y-auto pr-1">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B1A17]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#2540D9] text-white rounded">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-[#8A8576] tracking-wider">
                BUYER INTELLIGENCE ALERTS
              </div>
              <h2 className="text-xl font-bold font-display text-[#1B1A17]">
                Notifications Hub
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1B1A17]/10 rounded border border-[#1B1A17]/20 cursor-pointer"
          >
            <X className="w-5 h-5 text-[#1B1A17]" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isAutopilot = notif.type === "AUTOPILOT_TRIGGER";
            const isPriceDrop = notif.type === "PRICE_DROP";

            return (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif.id)}
                className={`p-3.5 rounded border-2 transition relative space-y-2 cursor-pointer ${
                  !notif.isRead
                    ? "bg-white border-[#1B1A17] shadow-sm"
                    : "bg-[#FBF7EA] border-[#1B1A17]/20 opacity-80"
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D8381C]" />
                )}

                <div className="flex items-center space-x-2 text-xs font-bold">
                  {isAutopilot ? (
                    <Zap className="w-4 h-4 text-[#D8381C]" />
                  ) : isPriceDrop ? (
                    <TrendingDown className="w-4 h-4 text-[#1F6B4F]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#2540D9]" />
                  )}
                  <span className="text-[#1B1A17] pr-3">{notif.title}</span>
                </div>

                <p className="text-[11px] text-[#8A8576] leading-relaxed">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#1B1A17]/10 text-[10px]">
                  <span className="text-[#8A8576]">{notif.timestamp}</span>

                  {notif.actionUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAutopilot && onOpenAutopilot) {
                          onClose();
                          onOpenAutopilot();
                        } else if (notif.actionUrl?.startsWith("http")) {
                          window.open(notif.actionUrl, "_blank");
                        }
                      }}
                      className="text-[#2540D9] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{notif.actionLabel || "View"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t-2 border-[#1B1A17] text-center">
        <button
          onClick={onClose}
          className="w-full py-2 bg-[#1B1A17] text-white text-xs font-bold uppercase rounded hover:bg-[#333] transition"
        >
          Close Hub
        </button>
      </div>
    </div>
  );
}
