import { generateText } from "@/lib/ai/claude";

export type AiPlatform =
  | "chatgpt"
  | "gemini"
  | "perplexity"
  | "claude"
  | "copilot"
  | "meta_ai";

export interface SimulationResult {
  platform: AiPlatform;
  query: string;
  response: string;
  citedDomains: string[];
  citedUrls: string[];
  brandMentions: string[];
  position: number | null;
  isCited: boolean;
  confidence: number;
  snippetUsed: string | null;
  simulatedAt: Date;
}

const PLATFORM_PROMPTS: Record<AiPlatform, string> = {
  chatgpt:
    "You are simulating how ChatGPT would respond to the following query. Respond naturally, cite sources where appropriate, and include domain names when referencing information.",
  gemini:
    "You are simulating how Google Gemini would respond to the following query. Include knowledge panel-style information and cite sources.",
  perplexity:
    "You are simulating how Perplexity AI would respond to the following query. Include inline citations with numbered references to source URLs.",
  claude:
    "You are simulating how Claude would respond to the following query. Be thorough and analytical, mentioning relevant sources.",
  copilot:
    "You are simulating how Microsoft Copilot would respond to the following query. Include Bing search results and cite web sources.",
  meta_ai:
    "You are simulating how Meta AI would respond to the following query. Be conversational and include relevant source mentions.",
};

const ALL_PLATFORMS: AiPlatform[] = [
  "chatgpt",
  "gemini",
  "perplexity",
  "claude",
  "copilot",
  "meta_ai",
];

function extractDomains(text: string): string[] {
  const urlPattern = /https?:\/\/([a-zA-Z0-9.-]+)/g;
  const domainPattern = /\b([a-zA-Z0-9-]+\.(com|org|net|io|edu|gov|co|vn|com\.vn))\b/g;

  const domains = new Set<string>();

  let match;
  while ((match = urlPattern.exec(text)) !== null) {
    domains.add(match[1].toLowerCase());
  }
  while ((match = domainPattern.exec(text)) !== null) {
    domains.add(match[1].toLowerCase());
  }

  return Array.from(domains);
}

function extractUrls(text: string): string[] {
  const urlPattern = /https?:\/\/[^\s)]+/g;
  const matches = text.match(urlPattern) || [];
  return [...new Set(matches)];
}

async function simulatePlatform(
  query: string,
  platform: AiPlatform
): Promise<SimulationResult> {
  // TODO: Implement real API calls to each platform
  // Currently uses Claude to simulate how each platform would respond
  try {
    const systemPrompt = PLATFORM_PROMPTS[platform];
    const prompt = `${systemPrompt}\n\nUser query: "${query}"\n\nProvide a realistic response as this AI platform would give. Include source citations/domains where natural.`;

    const response = await generateText(prompt, {
      maxTokens: 2048,
      temperature: 0.7,
    });

    const citedDomains = extractDomains(response);
    const citedUrls = extractUrls(response);

    return {
      platform,
      query,
      response,
      citedDomains,
      citedUrls,
      brandMentions: [], // TODO: Extract brand mentions based on project context
      position: null, // TODO: Determine position in the response
      isCited: false, // TODO: Check if our domain is cited
      confidence: 0.6, // Simulation confidence
      snippetUsed: null,
      simulatedAt: new Date(),
    };
  } catch (_error) {
    return {
      platform,
      query,
      response: "",
      citedDomains: [],
      citedUrls: [],
      brandMentions: [],
      position: null,
      isCited: false,
      confidence: 0,
      snippetUsed: null,
      simulatedAt: new Date(),
    };
  }
}

export async function simulateAiResponse(
  query: string,
  platforms?: string[]
): Promise<SimulationResult[]> {
  try {
    const targetPlatforms = platforms
      ? platforms.filter((p): p is AiPlatform =>
          ALL_PLATFORMS.includes(p as AiPlatform)
        )
      : ALL_PLATFORMS;

    const results = await Promise.allSettled(
      targetPlatforms.map((platform) => simulatePlatform(query, platform))
    );

    return results
      .filter(
        (r): r is PromiseFulfilledResult<SimulationResult> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value);
  } catch (error) {
    console.error("simulateAiResponse error:", error);
    throw new Error(
      `Failed to simulate AI responses: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
