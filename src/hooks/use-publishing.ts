"use client";

import { useState, useCallback } from "react";

export function usePublishing(projectId?: string) {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/publishing?projectId=${projectId}`);
      const data = await res.json();
      setJobs(data.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const scheduleJob = useCallback(
    async (params: { articleId: string; platform: string; scheduledAt: string }) => {
      const res = await fetch("/api/publishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...params, projectId }),
      });
      return await res.json();
    },
    [projectId]
  );

  const submitForIndexing = useCallback(
    async (url: string, method?: string) => {
      const res = await fetch("/api/publishing/indexing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, method, projectId }),
      });
      return await res.json();
    },
    [projectId]
  );

  return { jobs, isLoading, fetchJobs, scheduleJob, submitForIndexing };
}
