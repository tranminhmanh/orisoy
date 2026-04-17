import { simulateAiResponse, type AiPlatform, type SimulationResult } from "./simulation-engine";

export interface VisibilityResult {
  query: string;
  domain: string;
  platforms: PlatformVisibility[];
  overallVisibility: number;
  trend: "improving" | "stable" | "declining" | "new";
  checkedAt: Date;
}

export interface PlatformVisibility {
  platform: AiPlatform;
  isCited: boolean;
  isMentioned: boolean;
  position: number | null;
  snippetUsed: string | null;
  competitorsCited: string[];
  visibilityScore: number;
}

function checkDomainVisibility(
  simulation: SimulationResult,
  domain: string
): PlatformVisibility {
  const domainLower = domain.toLowerCase();
  const responseLower = simulation.response.toLowerCase();

  const isCited = simulation.citedDomains.some((d) =>
    d.includes(domainLower) || domainLower.includes(d)
  );

  const isMentioned = responseLower.includes(domainLower) ||
    responseLower.includes(domainLower.replace(/\./g, ""));

  // Determine position in response (1-based index of mention)
  let position: number | null = null;
  if (isCited || isMentioned) {
    const allDomains = simulation.citedDomains;
    const domainIndex = allDomains.findIndex(
      (d) => d.includes(domainLower) || domainLower.includes(d)
    );
    position = domainIndex >= 0 ? domainIndex + 1 : null;
  }

  // Extract snippet context if domain is mentioned
  let snippetUsed: string | null = null;
  if (isMentioned) {
    const idx = responseLower.indexOf(domainLower);
    if (idx >= 0) {
      const start = Math.max(0, idx - 100);
      const end = Math.min(simulation.response.length, idx + domainLower.length + 100);
      snippetUsed = simulation.response.slice(start, end);
    }
  }

  // Competitor domains mentioned (exclude our domain)
  const competitorsCited = simulation.citedDomains.filter(
    (d) => !d.includes(domainLower) && !domainLower.includes(d)
  );

  // Calculate visibility score for this platform
  let visibilityScore = 0;
  if (isCited) visibilityScore += 60;
  if (isMentioned) visibilityScore += 20;
  if (position !== null && position <= 3) visibilityScore += 20;
  else if (position !== null && position <= 5) visibilityScore += 10;

  return {
    platform: simulation.platform,
    isCited,
    isMentioned,
    position,
    snippetUsed,
    competitorsCited,
    visibilityScore: Math.min(100, visibilityScore),
  };
}

export async function trackAiVisibility(
  domain: string,
  queries: string[],
  platforms?: string[]
): Promise<VisibilityResult[]> {
  try {
    const results: VisibilityResult[] = [];

    for (const query of queries) {
      try {
        const simulations = await simulateAiResponse(query, platforms);

        const platformResults = simulations.map((sim) =>
          checkDomainVisibility(sim, domain)
        );

        const overallVisibility =
          platformResults.length > 0
            ? Math.round(
                platformResults.reduce((sum, p) => sum + p.visibilityScore, 0) /
                  platformResults.length
              )
            : 0;

        results.push({
          query,
          domain,
          platforms: platformResults,
          overallVisibility,
          trend: "new", // TODO: Compare with historical data from DB
          checkedAt: new Date(),
        });
      } catch {
        results.push({
          query,
          domain,
          platforms: [],
          overallVisibility: 0,
          trend: "new",
          checkedAt: new Date(),
        });
      }
    }

    return results;
  } catch (error) {
    console.error("trackAiVisibility error:", error);
    throw new Error(
      `Failed to track AI visibility: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
