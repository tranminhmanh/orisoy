import { dataForSeoClient } from "./dataforseo";

export interface CompetitorAnalysis {
  domain: string;
  overview: {
    organicTraffic: number;
    organicKeywords: number;
    backlinks: number;
    referringDomains: number;
    domainAuthority: number;
  };
  topKeywords: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
    url: string;
    traffic: number;
  }>;
  topPages: Array<{
    url: string;
    traffic: number;
    keywords: number;
  }>;
  contentGaps: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface OverlapResult {
  projectDomain: string;
  competitorDomain: string;
  sharedKeywords: Array<{
    keyword: string;
    projectPosition: number | null;
    competitorPosition: number;
    searchVolume: number;
    opportunity: "win" | "improve" | "defend" | "lost";
  }>;
  uniqueToCompetitor: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
  }>;
  uniqueToProject: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
  }>;
  overlapPercentage: number;
}

export async function analyzeCompetitor(
  domain: string,
  _projectId: string
): Promise<CompetitorAnalysis> {
  // TODO: Implement real competitor analysis using DataForSEO
  try {
    const [rankedKeywords, backlinks] = await Promise.allSettled([
      dataForSeoClient.getRankedKeywords(domain),
      dataForSeoClient.getBacklinks(domain),
    ]);

    const keywords =
      rankedKeywords.status === "fulfilled" ? rankedKeywords.value : null;
    const links =
      backlinks.status === "fulfilled" ? backlinks.value : null;

    const topKeywords = (keywords?.keywords ?? [])
      .slice(0, 50)
      .map((kw) => ({
        keyword: kw.keyword,
        position: kw.position,
        searchVolume: kw.searchVolume,
        url: kw.url,
        traffic: kw.traffic,
      }));

    // Aggregate top pages from keyword data
    const pageTrafficMap = new Map<string, { traffic: number; keywords: number }>();
    for (const kw of keywords?.keywords ?? []) {
      const existing = pageTrafficMap.get(kw.url) ?? { traffic: 0, keywords: 0 };
      existing.traffic += kw.traffic;
      existing.keywords += 1;
      pageTrafficMap.set(kw.url, existing);
    }

    const topPages = Array.from(pageTrafficMap.entries())
      .map(([url, data]) => ({ url, ...data }))
      .sort((a, b) => b.traffic - a.traffic)
      .slice(0, 20);

    return {
      domain,
      overview: {
        organicTraffic: topKeywords.reduce((sum, kw) => sum + kw.traffic, 0),
        organicKeywords: keywords?.totalKeywords ?? 0,
        backlinks: links?.totalBacklinks ?? 0,
        referringDomains: links?.referringDomains ?? 0,
        domainAuthority: 0, // TODO: Calculate or fetch DA
      },
      topKeywords,
      topPages,
      contentGaps: [], // TODO: Identify content gaps vs project
      strengths: [], // TODO: AI analysis of competitor strengths
      weaknesses: [], // TODO: AI analysis of competitor weaknesses
    };
  } catch (error) {
    console.error("analyzeCompetitor error:", error);
    throw new Error(
      `Failed to analyze competitor: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function getKeywordOverlap(
  projectDomain: string,
  competitorDomain: string
): Promise<OverlapResult> {
  // TODO: Implement real keyword overlap analysis
  try {
    const [projectKeywords, competitorKeywords] = await Promise.all([
      dataForSeoClient.getRankedKeywords(projectDomain),
      dataForSeoClient.getRankedKeywords(competitorDomain),
    ]);

    const projectMap = new Map(
      (projectKeywords.keywords ?? []).map((kw) => [
        kw.keyword.toLowerCase(),
        kw,
      ])
    );

    const competitorMap = new Map(
      (competitorKeywords.keywords ?? []).map((kw) => [
        kw.keyword.toLowerCase(),
        kw,
      ])
    );

    const sharedKeywords: OverlapResult["sharedKeywords"] = [];
    const uniqueToCompetitor: OverlapResult["uniqueToCompetitor"] = [];
    const uniqueToProject: OverlapResult["uniqueToProject"] = [];

    for (const [term, compKw] of competitorMap) {
      const projKw = projectMap.get(term);
      if (projKw) {
        let opportunity: "win" | "improve" | "defend" | "lost";
        if (!projKw.position) opportunity = "lost";
        else if (projKw.position < compKw.position) opportunity = "defend";
        else if (projKw.position - compKw.position <= 5) opportunity = "improve";
        else opportunity = "win";

        sharedKeywords.push({
          keyword: compKw.keyword,
          projectPosition: projKw.position,
          competitorPosition: compKw.position,
          searchVolume: compKw.searchVolume,
          opportunity,
        });
      } else {
        uniqueToCompetitor.push({
          keyword: compKw.keyword,
          position: compKw.position,
          searchVolume: compKw.searchVolume,
        });
      }
    }

    for (const [term, projKw] of projectMap) {
      if (!competitorMap.has(term)) {
        uniqueToProject.push({
          keyword: projKw.keyword,
          position: projKw.position,
          searchVolume: projKw.searchVolume,
        });
      }
    }

    const totalUniqueKeywords = new Set([
      ...projectMap.keys(),
      ...competitorMap.keys(),
    ]).size;

    return {
      projectDomain,
      competitorDomain,
      sharedKeywords: sharedKeywords.sort(
        (a, b) => b.searchVolume - a.searchVolume
      ),
      uniqueToCompetitor: uniqueToCompetitor.sort(
        (a, b) => b.searchVolume - a.searchVolume
      ),
      uniqueToProject: uniqueToProject.sort(
        (a, b) => b.searchVolume - a.searchVolume
      ),
      overlapPercentage:
        totalUniqueKeywords > 0
          ? Math.round((sharedKeywords.length / totalUniqueKeywords) * 100)
          : 0,
    };
  } catch (error) {
    console.error("getKeywordOverlap error:", error);
    throw new Error(
      `Failed to get keyword overlap: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
