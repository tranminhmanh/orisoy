interface LighthouseAudit {
  id?: string;
  title?: string;
  description?: string;
  displayValue?: string;
  numericValue?: number;
  details?: { type?: string; overallSavingsMs?: number };
}

export interface PageSpeedResult {
  url: string;
  strategy: "mobile" | "desktop";
  performanceScore: number;
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
    timeToInteractive: number;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    savings: number;
    savingsUnit: string;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    displayValue: string;
  }>;
  coreWebVitals: {
    lcp: { value: number; rating: "good" | "needs-improvement" | "poor" };
    fid: { value: number; rating: "good" | "needs-improvement" | "poor" };
    cls: { value: number; rating: "good" | "needs-improvement" | "poor" };
    inp: { value: number; rating: "good" | "needs-improvement" | "poor" };
  };
}

function rateMetric(
  value: number,
  goodThreshold: number,
  poorThreshold: number
): "good" | "needs-improvement" | "poor" {
  if (value <= goodThreshold) return "good";
  if (value <= poorThreshold) return "needs-improvement";
  return "poor";
}

export async function getPageSpeedData(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<PageSpeedResult> {
  // TODO: Implement real PageSpeed Insights API call
  try {
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!apiKey) {
      throw new Error("Google PageSpeed API key not configured");
    }

    const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    apiUrl.searchParams.set("url", url);
    apiUrl.searchParams.set("key", apiKey);
    apiUrl.searchParams.set("strategy", strategy);
    apiUrl.searchParams.set("category", "performance");

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse?.audits ?? {};
    const categories = lighthouse?.categories ?? {};

    const fcp = audits["first-contentful-paint"]?.numericValue ?? 0;
    const lcp = audits["largest-contentful-paint"]?.numericValue ?? 0;
    const tbt = audits["total-blocking-time"]?.numericValue ?? 0;
    const cls = audits["cumulative-layout-shift"]?.numericValue ?? 0;
    const si = audits["speed-index"]?.numericValue ?? 0;
    const tti = audits["interactive"]?.numericValue ?? 0;

    // Extract opportunities
    const opportunities = Object.values(audits)
      .filter((a) => { const audit = a as LighthouseAudit; return audit.details?.type === "opportunity" && (audit.details?.overallSavingsMs ?? 0) > 0; })
      .map((a) => { const audit = a as LighthouseAudit; return {
        id: audit.id ?? "",
        title: audit.title ?? "",
        description: audit.description ?? "",
        savings: audit.details?.overallSavingsMs ?? 0,
        savingsUnit: "ms",
      }; });

    // Extract diagnostics
    const diagnostics = Object.values(audits)
      .filter((a) => { const audit = a as LighthouseAudit; return audit.details?.type === "table" || audit.details?.type === "list"; })
      .slice(0, 10)
      .map((a) => { const audit = a as LighthouseAudit; return {
        id: audit.id ?? "",
        title: audit.title ?? "",
        description: audit.description ?? "",
        displayValue: audit.displayValue ?? "",
      }; });

    return {
      url,
      strategy,
      performanceScore: Math.round((categories.performance?.score ?? 0) * 100),
      metrics: {
        firstContentfulPaint: fcp,
        largestContentfulPaint: lcp,
        totalBlockingTime: tbt,
        cumulativeLayoutShift: cls,
        speedIndex: si,
        timeToInteractive: tti,
      },
      opportunities,
      diagnostics,
      coreWebVitals: {
        lcp: { value: lcp, rating: rateMetric(lcp, 2500, 4000) },
        fid: { value: tbt, rating: rateMetric(tbt, 100, 300) },
        cls: { value: cls, rating: rateMetric(cls, 0.1, 0.25) },
        inp: { value: 0, rating: "good" }, // TODO: Get real INP data
      },
    };
  } catch (error) {
    console.error("getPageSpeedData error:", error);
    throw new Error(
      `Failed to get PageSpeed data: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
