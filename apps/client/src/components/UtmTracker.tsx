"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function UtmTracker() {
  const searchParams = useSearchParams();

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
