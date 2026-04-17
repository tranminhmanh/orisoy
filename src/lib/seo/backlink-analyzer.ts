import { dataForSeoClient } from "./dataforseo";

export interface BacklinkProfile {
  domain: string;
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority: number;
  anchorTextDistribution: Array<{
    anchor: string;
    count: number;
    percentage: number;
  }>;
  linkTypeDistribution: {
    dofollow: number;
    nofollow: number;
    ugc: number;
    sponsored: number;
  };
  topReferringDomains: Array<{
    domain: string;
    backlinks: number;
    authority: number;
    firstSeen: string;
  }>;
  newBacklinks: Array<{
    sourceUrl: string;
    targetUrl: string;
    anchorText: string;
    firstSeen: string;
  }>;
  lostBacklinks: Array<{
    sourceUrl: string;
    targetUrl: string;
    anchorText: string;
    lastSeen: string;
  }>;
}

export interface ToxicLinkResult {
  url: string;
  domain: string;
  toxicityScore: number;
  reasons: string[];
  recommendation: "disavow" | "monitor" | "safe";
}

export interface GapResult {
  domain: string;
  referringDomain: string;
  authority: number;
  linksToCompetitor: number;
  opportunity: "high" | "medium" | "low";
  prospectType: string;
}

export async function analyzeBacklinks(
  domain: string
): Promise<BacklinkProfile> {
  // TODO: Implement real backlink analysis using DataForSEO
  try {
    const backlinkData = await dataForSeoClient.getBacklinks(domain);

    const backlinks = backlinkData.backlinks ?? [];

    // Calculate anchor text distribution
    const anchorCounts = new Map<string, number>();
    let dofollowCount = 0;
    let nofollowCount = 0;

    for (const link of backlinks) {
      const anchor = link.anchorText || "(empty)";
      anchorCounts.set(anchor, (anchorCounts.get(anchor) ?? 0) + 1);
      if (link.dofollow) dofollowCount++;
      else nofollowCount++;
    }

    const anchorTextDistribution = Array.from(anchorCounts.entries())
      .map(([anchor, count]) => ({
        anchor,
        count,
        percentage: backlinks.length > 0
          ? Math.round((count / backlinks.length) * 100)
          : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Calculate top referring domains
    const domainCounts = new Map<string, { count: number; authority: number; firstSeen: string }>();
    for (const link of backlinks) {
      const sourceDomain = new URL(link.sourceUrl).hostname;
      const existing = domainCounts.get(sourceDomain);
      if (!existing) {
        domainCounts.set(sourceDomain, {
          count: 1,
          authority: link.domainAuthority,
          firstSeen: link.firstSeen,
        });
      } else {
        existing.count++;
      }
    }

    const topReferringDomains = Array.from(domainCounts.entries())
      .map(([d, data]) => ({
        domain: d,
        backlinks: data.count,
        authority: data.authority,
        firstSeen: data.firstSeen,
      }))
      .sort((a, b) => b.authority - a.authority)
      .slice(0, 20);

    return {
      domain,
      totalBacklinks: backlinkData.totalBacklinks ?? backlinks.length,
      referringDomains: backlinkData.referringDomains ?? domainCounts.size,
      domainAuthority: 0, // TODO: Calculate or fetch DA
      anchorTextDistribution,
      linkTypeDistribution: {
        dofollow: dofollowCount,
        nofollow: nofollowCount,
        ugc: 0, // TODO: Detect UGC links
        sponsored: 0, // TODO: Detect sponsored links
      },
      topReferringDomains,
      newBacklinks: [], // TODO: Implement new backlink detection
      lostBacklinks: [], // TODO: Implement lost backlink detection
    };
  } catch (error) {
    console.error("analyzeBacklinks error:", error);
    throw new Error(
      `Failed to analyze backlinks: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function detectToxicLinks(
  backlinks: Array<{
    sourceUrl: string;
    sourceDomain: string;
    anchorText: string;
    dofollow: boolean;
    domainAuthority?: number;
  }>
): Promise<ToxicLinkResult[]> {
  // TODO: Implement real toxic link detection with ML model
  try {
    return backlinks.map((link) => {
      const reasons: string[] = [];
      let toxicityScore = 0;

      // Check for spammy domain patterns
      if (/\d{4,}/.test(link.sourceDomain)) {
        reasons.push("Domain contains many consecutive numbers");
        toxicityScore += 20;
      }

      if (link.sourceDomain.length > 30) {
        reasons.push("Unusually long domain name");
        toxicityScore += 10;
      }

      // Check for exact match anchor text over-optimization
      // (simplified heuristic)
      if (link.anchorText.split(" ").length > 5) {
        reasons.push("Over-optimized anchor text");
        toxicityScore += 15;
      }

      // Low authority domains
      if (link.domainAuthority !== undefined && link.domainAuthority < 10) {
        reasons.push("Very low domain authority");
        toxicityScore += 15;
      }

      // Determine recommendation
      let recommendation: "disavow" | "monitor" | "safe";
      if (toxicityScore >= 50) recommendation = "disavow";
      else if (toxicityScore >= 25) recommendation = "monitor";
      else recommendation = "safe";

      return {
        url: link.sourceUrl,
        domain: link.sourceDomain,
        toxicityScore: Math.min(100, toxicityScore),
        reasons,
        recommendation,
      };
    });
  } catch (error) {
    console.error("detectToxicLinks error:", error);
    throw new Error(
      `Failed to detect toxic links: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function findBacklinkGap(
  myDomain: string,
  competitorDomains: string[]
): Promise<GapResult[]> {
  // TODO: Implement real backlink gap analysis
  try {
    const myBacklinks = await dataForSeoClient.getBacklinks(myDomain);
    const myReferringDomains = new Set(
      (myBacklinks.backlinks ?? []).map((b) => {
        try {
          return new URL(b.sourceUrl).hostname;
        } catch {
          return "";
        }
      })
    );

    const gaps: GapResult[] = [];

    for (const competitor of competitorDomains) {
      try {
        const compBacklinks = await dataForSeoClient.getBacklinks(competitor);

        const compDomainMap = new Map<string, { count: number; authority: number }>();
        for (const link of compBacklinks.backlinks ?? []) {
          try {
            const sourceDomain = new URL(link.sourceUrl).hostname;
            const existing = compDomainMap.get(sourceDomain);
            if (!existing) {
              compDomainMap.set(sourceDomain, {
                count: 1,
                authority: link.domainAuthority,
              });
            } else {
              existing.count++;
            }
          } catch {
            continue;
          }
        }

        for (const [refDomain, data] of compDomainMap) {
          if (!myReferringDomains.has(refDomain)) {
            let opportunity: "high" | "medium" | "low";
            if (data.authority > 50) opportunity = "high";
            else if (data.authority > 20) opportunity = "medium";
            else opportunity = "low";

            gaps.push({
              domain: competitor,
              referringDomain: refDomain,
              authority: data.authority,
              linksToCompetitor: data.count,
              opportunity,
              prospectType: data.count > 1 ? "recurring_linker" : "one_time",
            });
          }
        }
      } catch {
        continue;
      }
    }

    return gaps
      .sort((a, b) => b.authority - a.authority)
      .slice(0, 100);
  } catch (error) {
    console.error("findBacklinkGap error:", error);
    throw new Error(
      `Failed to find backlink gap: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
