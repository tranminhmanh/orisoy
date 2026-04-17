"use client";

import { useState, useCallback } from "react";

interface KeywordData {
  id: string;
  term: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  trend: number[];
  hasAiOverview: boolean;
  geoOpportunity: string;
}

interface ClusterData {
  id: string;
  name: string;
  contentType: string;
  totalVolume: number;
  priorityScore: number;
  keywords: Array<{ term: string; searchVolume: number }>;
}

export function useKeywords(projectId?: string) {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchKeywords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/keywords?projectId=${projectId}`);
      const data = await res.json();
      setKeywords(data.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const discoverKeywords = useCallback(
    async (params: { seed: string; country?: string; language?: string; sources?: string[] }) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/keywords/discover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...params, projectId }),
        });
        const data = await res.json();
        setKeywords((prev) => [...prev, ...(data.data || [])]);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  const clusterKeywords = useCallback(
    async (keywordIds: string[]) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/keywords/cluster", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keywordIds, projectId }),
        });
        const data = await res.json();
        setClusters(data.data || []);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  return { keywords, clusters, isLoading, fetchKeywords, discoverKeywords, clusterKeywords };
}
