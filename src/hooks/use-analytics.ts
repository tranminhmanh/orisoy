"use client";

import { useState, useCallback } from "react";

export function useAnalytics(projectId?: string) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics?projectId=${projectId}`);
      const data = await res.json();
      setDashboardData(data.data);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchRankings = useCallback(async (dateRange?: { start: string; end: string }) => {
    const params = new URLSearchParams({ projectId: projectId || "" });
    if (dateRange) {
      params.set("start", dateRange.start);
      params.set("end", dateRange.end);
    }
    const res = await fetch(`/api/analytics/rankings?${params}`);
    return await res.json();
  }, [projectId]);

  const fetchRoi = useCallback(async () => {
    const res = await fetch(`/api/analytics/roi?projectId=${projectId}`);
    return await res.json();
  }, [projectId]);

  const generateReport = useCallback(
    async (type: "weekly" | "monthly" | "quarterly") => {
      const res = await fetch("/api/analytics/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, projectId }),
      });
      return await res.json();
    },
    [projectId]
  );

  return { dashboardData, isLoading, fetchDashboard, fetchRankings, fetchRoi, generateReport };
}
