import { prisma } from "@/lib/prisma";
import { dataForSeoClient } from "./dataforseo";
import { suggestKeywords } from "@/lib/ai/keyword-analyzer";

export interface DiscoveredKeyword {
  term: string;
  source: KeywordSource;
  searchVolume: number | null;
  cpc: number | null;
  competition: number | null;
  intent: string | null;
}

export type KeywordSource =
  | "autocomplete"
  | "related"
  | "paa"
  | "questions"
  | "longtail"
  | "competitor"
  | "ai";

const ALL_SOURCES: KeywordSource[] = [
  "autocomplete",
  "related",
  "paa",
  "questions",
  "longtail",
  "competitor",
  "ai",
];

async function fetchFromAutocomplete(seed: string): Promise<DiscoveredKeyword[]> {
  // TODO: Implement real autocomplete fetching
  try {
    const suggestions = await dataForSeoClient.getAutocompleteSuggestions(seed);
    return (Array.isArray(suggestions) ? suggestions : []).map((term) => ({
      term: String(term),
      source: "autocomplete" as const,
      searchVolume: null,
      cpc: null,
      competition: null,
      intent: null,
    }));
  } catch {
    return [];
  }
}

async function fetchRelated(seed: string): Promise<DiscoveredKeyword[]> {
  // TODO: Implement real related keywords fetching
  try {
    const result = await dataForSeoClient.getRelatedKeywords(seed);
    return (result.relatedKeywords ?? []).map((kw) => ({
      term: kw.keyword,
      source: "related" as const,
      searchVolume: kw.searchVolume,
      cpc: kw.cpc,
      competition: kw.competition,
      intent: null,
    }));
  } catch {
    return [];
  }
}

async function fetchPaa(seed: string): Promise<DiscoveredKeyword[]> {
  // TODO: Implement real PAA fetching
  try {
    const questions = await dataForSeoClient.getPeopleAlsoAsk(seed);
    return (Array.isArray(questions) ? questions : []).map((q) => ({
      term: String(q),
      source: "paa" as const,
      searchVolume: null,
      cpc: null,
      competition: null,
      intent: "informational",
    }));
  } catch {
    return [];
  }
}

async function fetchQuestions(seed: string): Promise<DiscoveredKeyword[]> {
  // TODO: Implement question keyword generation
  const questionPrefixes = [
    "what is", "how to", "why", "when to", "where to", "which",
    "la gi", "cach", "tai sao", "khi nao", "o dau", "nao",
  ];

  return questionPrefixes.map((prefix) => ({
    term: `${prefix} ${seed}`,
    source: "questions" as const,
    searchVolume: null,
    cpc: null,
    competition: null,
    intent: "informational",
  }));
}

async function fetchLongtail(seed: string): Promise<DiscoveredKeyword[]> {
  // TODO: Implement real long-tail keyword generation
  const modifiers = [
    "best", "top", "cheap", "free", "review", "guide",
    "tot nhat", "mien phi", "gia re", "huong dan", "danh gia",
  ];

  return modifiers.map((mod) => ({
    term: `${seed} ${mod}`,
    source: "longtail" as const,
    searchVolume: null,
    cpc: null,
    competition: null,
    intent: null,
  }));
}

async function fetchCompetitor(seed: string, projectId: string): Promise<DiscoveredKeyword[]> {
  // TODO: Implement real competitor keyword fetching
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { competitorDomains: true },
    });

    if (!project?.competitorDomains?.length) return [];

    const allKeywords: DiscoveredKeyword[] = [];
    for (const competitor of project.competitorDomains.slice(0, 3)) {
      try {
        const result = await dataForSeoClient.getRankedKeywords(competitor.domain);
        const keywords = (result.keywords ?? [])
          .filter((kw) => kw.keyword.toLowerCase().includes(seed.toLowerCase()))
          .map((kw) => ({
            term: kw.keyword,
            source: "competitor" as const,
            searchVolume: kw.searchVolume,
            cpc: kw.cpc,
            competition: null,
            intent: null,
          }));
        allKeywords.push(...keywords);
      } catch {
        continue;
      }
    }

    return allKeywords;
  } catch {
    return [];
  }
}

async function fetchAiSuggestions(seed: string): Promise<DiscoveredKeyword[]> {
  // TODO: Implement real AI keyword suggestions
  try {
    const suggestions = await suggestKeywords(seed);
    return suggestions.map((s) => ({
      term: s.term,
      source: "ai" as const,
      searchVolume: null,
      cpc: null,
      competition: null,
      intent: s.intent,
    }));
  } catch {
    return [];
  }
}

const SOURCE_FETCHERS: Record<KeywordSource, (seed: string, projectId: string) => Promise<DiscoveredKeyword[]>> = {
  autocomplete: (seed) => fetchFromAutocomplete(seed),
  related: (seed) => fetchRelated(seed),
  paa: (seed) => fetchPaa(seed),
  questions: (seed) => fetchQuestions(seed),
  longtail: (seed) => fetchLongtail(seed),
  competitor: (seed, projectId) => fetchCompetitor(seed, projectId),
  ai: (seed) => fetchAiSuggestions(seed),
};

export async function discoverKeywords(
  seed: string,
  projectId: string,
  options?: { sources?: string[]; location?: number; language?: string }
): Promise<DiscoveredKeyword[]> {
  try {
    const sources = (options?.sources ?? ALL_SOURCES) as KeywordSource[];
    const validSources = sources.filter((s): s is KeywordSource =>
      ALL_SOURCES.includes(s as KeywordSource)
    );

    const results = await Promise.allSettled(
      validSources.map((source) => SOURCE_FETCHERS[source](seed, projectId))
    );

    const allKeywords: DiscoveredKeyword[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        allKeywords.push(...result.value);
      }
    }

    // Deduplicate by term (keep first occurrence)
    const seen = new Set<string>();
    const deduplicated = allKeywords.filter((kw) => {
      const normalized = kw.term.toLowerCase().trim();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });

    return deduplicated;
  } catch (error) {
    console.error("discoverKeywords error:", error);
    throw new Error(
      `Failed to discover keywords: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
