import { prisma } from "@/lib/prisma";
import { dataForSeoClient } from "./dataforseo";

export interface ClusterResult {
  name: string;
  pillarKeyword: string;
  keywords: Array<{
    id: string;
    term: string;
    searchVolume: number | null;
    serpOverlap: number;
  }>;
  avgSearchVolume: number;
  totalSearchVolume: number;
  suggestedContentType: string;
}

interface SerpOverlapEntry {
  keywordId: string;
  term: string;
  searchVolume: number | null;
  serpUrls: string[];
}

export async function clusterKeywords(
  keywordIds: string[],
  projectId: string,
  options?: { minOverlap?: number }
): Promise<ClusterResult[]> {
  // TODO: Implement real SERP-based keyword clustering
  try {
    const minOverlap = options?.minOverlap ?? 3;

    // Fetch keywords from database
    const keywords = await prisma.keyword.findMany({
      where: {
        id: { in: keywordIds },
        projectId,
      },
    });

    if (keywords.length === 0) {
      return [];
    }

    // Fetch SERP results for each keyword to compare URL overlap
    const serpEntries: SerpOverlapEntry[] = [];

    for (const keyword of keywords) {
      try {
        const serp = await dataForSeoClient.getSerpResults(keyword.term);
        const topUrls = (serp.items ?? [])
          .slice(0, 10)
          .map((item) => item.url);

        serpEntries.push({
          keywordId: keyword.id,
          term: keyword.term,
          searchVolume: keyword.searchVolume,
          serpUrls: topUrls,
        });
      } catch {
        serpEntries.push({
          keywordId: keyword.id,
          term: keyword.term,
          searchVolume: keyword.searchVolume,
          serpUrls: [],
        });
      }
    }

    // Cluster by SERP URL overlap
    const clusters: ClusterResult[] = [];
    const assigned = new Set<string>();

    // Sort by search volume descending to pick pillar keywords first
    const sorted = [...serpEntries].sort(
      (a, b) => (b.searchVolume ?? 0) - (a.searchVolume ?? 0)
    );

    for (const entry of sorted) {
      if (assigned.has(entry.keywordId)) continue;

      const clusterKeywords: ClusterResult["keywords"] = [
        {
          id: entry.keywordId,
          term: entry.term,
          searchVolume: entry.searchVolume,
          serpOverlap: 10,
        },
      ];
      assigned.add(entry.keywordId);

      // Find keywords with SERP overlap
      for (const candidate of sorted) {
        if (assigned.has(candidate.keywordId)) continue;

        const overlap = entry.serpUrls.filter((url) =>
          candidate.serpUrls.includes(url)
        ).length;

        if (overlap >= minOverlap) {
          clusterKeywords.push({
            id: candidate.keywordId,
            term: candidate.term,
            searchVolume: candidate.searchVolume,
            serpOverlap: overlap,
          });
          assigned.add(candidate.keywordId);
        }
      }

      const totalVolume = clusterKeywords.reduce(
        (sum, kw) => sum + (kw.searchVolume ?? 0),
        0
      );

      clusters.push({
        name: entry.term, // Pillar keyword as cluster name
        pillarKeyword: entry.term,
        keywords: clusterKeywords,
        avgSearchVolume:
          clusterKeywords.length > 0
            ? Math.round(totalVolume / clusterKeywords.length)
            : 0,
        totalSearchVolume: totalVolume,
        suggestedContentType: inferContentType(clusterKeywords.length, entry.term),
      });
    }

    return clusters.sort((a, b) => b.totalSearchVolume - a.totalSearchVolume);
  } catch (error) {
    console.error("clusterKeywords error:", error);
    throw new Error(
      `Failed to cluster keywords: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

function inferContentType(keywordCount: number, pillarTerm: string): string {
  const termLower = pillarTerm.toLowerCase();

  if (termLower.includes("vs") || termLower.includes("so sanh")) return "comparison";
  if (termLower.includes("review") || termLower.includes("danh gia")) return "review";
  if (termLower.includes("how") || termLower.includes("cach") || termLower.includes("huong dan")) return "guide";
  if (termLower.includes("what") || termLower.includes("la gi")) return "definition";
  if (keywordCount > 10) return "pillar_page";
  if (keywordCount > 5) return "long_form_article";
  return "blog_post";
}
