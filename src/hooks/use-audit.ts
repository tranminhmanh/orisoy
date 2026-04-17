"use client";

import { useState, useCallback } from "react";

export function useAudit(projectId?: string) {
  const [audit, setAudit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runCrawl = useCallback(
    async (domain: string, maxPages?: number) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/audit/crawl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain, maxPages, projectId }),
        });
        const data = await res.json();
        setAudit(data.data);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  const getVitals = useCallback(async (url: string) => {
    const res = await fetch(`/api/audit/vitals?url=${encodeURIComponent(url)}`);
    return await res.json();
  }, []);

  const generateSchema = useCallback(async (url: string, type: string, data: any) => {
    const res = await fetch("/api/audit/schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, type, data }),
    });
    return await res.json();
  }, []);

  return { audit, isLoading, runCrawl, getVitals, generateSchema };
}
