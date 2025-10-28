"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "sonner";

/**
 * Monitors user session and handles token refresh
 * Place in root layout to run app-wide
 */
export function SessionMonitor() {
  const { isAuthenticated, refreshToken } = useAuthStore();
  const refreshIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear interval if user logs out
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      return;
    }

    // Refresh token every 14 minutes (access token expires in 15 min)
    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

    const startRefreshInterval = () => {
      refreshIntervalRef.current = setInterval(async () => {
        try {
          await refreshToken();
          console.log("✅ Token refreshed successfully");
        } catch (error) {
          console.error("❌ Token refresh failed:", error);
          // Don't show toast on silent refresh failure
          // User will be redirected to login on next API call
        }
      }, REFRESH_INTERVAL);
    };

    startRefreshInterval();

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [isAuthenticated, refreshToken]);

  // Handle visibility change (tab focus)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        // Tab became visible, refresh token
        try {
          await refreshToken();
          console.log("✅ Token refreshed on tab focus");
        } catch (error) {
          console.error("❌ Token refresh failed on tab focus");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, refreshToken]);

  return null; // This component doesn't render anything
}
