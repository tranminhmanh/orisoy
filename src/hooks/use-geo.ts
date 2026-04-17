"use client";

import { useState, useCallback } from "react";

export function useGeo(projectId?: string) {
  const [isLoading, setIsLoading] = useState(false);

  const calculateCitability = useCallback(async (content: string, query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/geo/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, query, projectId }),
      });
      return await res.json();
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const simulate = useCallback(
    async (query: string, platforms?: string[]) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/geo/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, platforms, projectId }),
        });
        return await res.json();
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  const getVisibility = useCallback(async () => {
    const res = await fetch(`/api/geo/visibility?projectId=${projectId}`);
    return await res.json();
  }, [projectId]);

  return { isLoading, calculateCitability, simulate, getVisibility };
}
