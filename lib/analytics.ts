"use client";

import { useEffect } from "react";

type TrackProps = Record<string, string | number | boolean>;

type AnalyticsOptions = {
  autoTrack?: boolean;
  eventName?: string;
  properties?: TrackProps;
};

const ANALYTICS_FLAG = "NEXT_PUBLIC_VERCEL_ANALYTICS";

function isAnalyticsEnabled(): boolean {
  return process.env[ANALYTICS_FLAG] === "true";
}

export function useAnalytics(options: AnalyticsOptions = {}): void {
  const { autoTrack = true, eventName = "pageview", properties } = options;

  useEffect(() => {
    if (!autoTrack || !isAnalyticsEnabled()) {
      return;
    }

    void track(eventName, properties ?? {});
  }, [autoTrack, eventName, properties]);
}

export async function track(name: string, properties: TrackProps = {}): Promise<void> {
  if (!isAnalyticsEnabled()) {
    return;
  }

  try {
    const analytics = await import("@vercel/analytics");
    if (typeof analytics.track === "function") {
      analytics.track(name, properties);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Analytics disabled or unavailable", error);
    }
  }
}
