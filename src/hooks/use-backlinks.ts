"use client";

import { useState, useCallback } from "react";

export function useBacklinks(projectId?: string) {
  const [backlinks, setBacklinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBacklinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/backlinks?projectId=${projectId}`);
      const data = await res.json();
      setBacklinks(data.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const analyzeToxic = useCallback(async () => {
    const res = await fetch(`/api/backlinks/toxic?projectId=${projectId}`);
    return await res.json();
  }, [projectId]);

  const findGap = useCallback(
    async (competitors: string[]) => {
      const res = await fetch("/api/backlinks/gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitors, projectId }),
      });
      return await res.json();
    },
    [projectId]
  );

  const generateOutreach = useCallback(async (params: any) => {
    const res = await fetch("/api/backlinks/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await res.json();
  }, []);

  return { backlinks, isLoading, fetchBacklinks, analyzeToxic, findGap, generateOutreach };
}
