/**
 * VERDICT — Privacy-First Revenue & Engagement Analytics Foundation
 * 
 * Strict architectural rule: Analytics must respect privacy and consent.
 * ZERO PII (Personally Identifiable Information) collected.
 */

export type AnalyticsEventType =
  | "SEARCH_PERFORMED"
  | "CATEGORY_EVALUATED"
  | "EXHIBIT_CLICKED"
  | "AFFILIATE_CLICKED"
  | "RADAR_EXPANDED"
  | "AUTOPILOT_RULE_CREATED"
  | "SCAN_PERFORMED"
  | "VOICE_RECOGNITION_USED"
  | "DNA_MODIFIED"
  | "CALENDAR_ICS_EXPORTED"
  | "PLUS_MODAL_VIEWED"
  | "PLUS_TIER_TOGGLED";

export interface AnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

const STORAGE_KEY = "verdict_local_analytics_log";

/**
 * Tracks an analytics event locally with server-side reporting fallback.
 */
export function trackEvent(
  eventType: AnalyticsEventType,
  metadata?: Record<string, string | number | boolean | null | undefined>
): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    eventType,
    timestamp: new Date().toISOString(),
    metadata,
  };

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
      // Keep last 100 events locally
      existing.unshift(event);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));

      // Asynchronously beacon to server without blocking UI
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/track", JSON.stringify(event));
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
          keepalive: true,
        }).catch(() => {
          // Silent non-blocking fail
        });
      }
    } catch {
      // Ignore local storage quota limits
    }
  }

  return event;
}

/**
 * Returns recorded analytics events for internal auditing.
 */
export function getRecordedAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
}
