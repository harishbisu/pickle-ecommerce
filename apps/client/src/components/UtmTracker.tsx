"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { promotionsApi } from "../lib/api";

export function UtmTracker() {
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!searchParams) return;

    // List of tracking parameters we want to look for
    const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utmmedia"];
    
    let hasTrackingParams = false;
    const currentParams: Record<string, string> = {};

    trackingKeys.forEach(key => {
      const val = searchParams.get(key);
      if (val) {
        currentParams[key] = val;
        hasTrackingParams = true;
      }
    });

    const utmMediaVal = searchParams.get("utmmedia");
    if (utmMediaVal && !trackedRef.current) {
      trackedRef.current = true;
      promotionsApi.track(utmMediaVal).catch((e) => console.error("Failed to track promotion", e));
    }

    // Save tracking params to localStorage to persist across sessions/login
    if (hasTrackingParams) {
      try {
        const existingRaw = localStorage.getItem("pickle_tracking") || "{}";
        const existing = JSON.parse(existingRaw);
        
        // Merge with existing, overwrite older keys
        const merged = { ...existing, ...currentParams, timestamp: new Date().toISOString() };
        localStorage.setItem("pickle_tracking", JSON.stringify(merged));
      } catch (e) {
        console.error("Failed to save UTM parameters", e);
      }
    }
  }, [searchParams]);

  return null;
}
