"use client";

import { useState, useCallback } from "react";

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  seoScore: number;
  geoScore: number;
  wordCount: number;
  targetKeyword?: string;
  updatedAt: string;
}

export function useContent(projectId?: string) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/content?projectId=${projectId}`);
      const data = await res.json();
      setArticles(data.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const generateBrief = useCallback(
    async (clusterId: string) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/content/brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clusterId, projectId }),
        });
        return await res.json();
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  const generateArticle = useCallback(
    async (params: { briefId: string; tone: string; wordCount: number; model?: string }) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/content/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...params, projectId }),
        });
        return await res.json();
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  const scoreContent = useCallback(async (content: string, keyword: string) => {
    const res = await fetch("/api/content/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, keyword }),
    });
    return await res.json();
  }, []);

  return { articles, isLoading, fetchArticles, generateBrief, generateArticle, scoreContent };
}
