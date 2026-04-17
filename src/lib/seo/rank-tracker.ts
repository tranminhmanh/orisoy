import { dataForSeoClient } from "./dataforseo";

export interface RankingResult {
  keyword: string;
  position: number | null;
  previousPosition: number | null;
  change: number | null;
  url: string | null;
  searchVolume: number | null;
  engine: string;
  device: string;
  location: string;
  features: string[];
  checkedAt: Date;
}

export async function trackRankings(
  keywords: string[],
  domain: string,
  options?: {
    engine?: string;
    device?: string;
    location?: string;
  }
): Promise<RankingResult[]> {
  // TODO: Implement real rank tracking with DataForSEO SERP API
  const engine = options?.engine ?? "google";
  const device = options?.device ?? "desktop";
  const location = options?.location ?? "Vietnam";

  try {
    const results: RankingResult[] = [];

    for (const keyword of keywords) {
      try {
        const serpData = await dataForSeoClient.getSerpResults(keyword);
        const items = serpData.items ?? [];

        // Find our domain in results
        const domainLower = domain.toLowerCase();
        const ourResult = items.find((item) =>
          item.domain?.toLowerCase().includes(domainLower) ||
          item.url?.toLowerCase().includes(domainLower)
        );

        results.push({
          keyword,
          position: ourResult?.position ?? null,
          previousPosition: null, // TODO: Fetch from DB history
          change: null, // TODO: Calculate from previous position
          url: ourResult?.url ?? null,
          searchVolume: null, // TODO: Fetch from keyword data
          engine,
          device,
          location,
          features: serpData.features ?? [],
          checkedAt: new Date(),
        });
      } catch {
        results.push({
          keyword,
          position: null,
          previousPosition: null,
          change: null,
          url: null,
          searchVolume: null,
          engine,
          device,
          location,
          features: [],
          checkedAt: new Date(),
        });
      }
    }

    return results;
  } catch (error) {
    console.error("trackRankings error:", error);
    throw new Error(
      `Failed to track rankings: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
