import { generateText } from "./claude";

export type SearchIntentType =
  | "informational"
  | "navigational"
  | "commercial"
  | "transactional"
  | "local"
  | "generative";

export interface IntentClassification {
  intent: SearchIntentType;
  confidence: number;
  signals: string[];
}

const INTENT_SIGNALS: Record<SearchIntentType, string[]> = {
  informational: [
    "what", "how", "why", "who", "when", "where", "guide", "tutorial",
    "learn", "tips", "examples", "definition", "meaning",
    "la gi", "huong dan", "cach", "tai sao", "khi nao",
  ],
  navigational: [
    "login", "sign in", "website", "official", "homepage",
    "dang nhap", "trang chu",
  ],
  commercial: [
    "best", "top", "review", "comparison", "vs", "alternative",
    "tot nhat", "so sanh", "danh gia",
  ],
  transactional: [
    "buy", "price", "cheap", "discount", "order", "subscribe", "coupon",
    "mua", "gia", "re", "dat hang", "giam gia",
  ],
  local: [
    "near me", "nearby", "in city", "address", "directions", "open now",
    "gan day", "dia chi", "o dau",
  ],
  generative: [
    "explain", "summarize", "create", "generate", "write", "compose",
    "giai thich", "tom tat", "tao", "viet",
  ],
};

export async function classifySearchIntent(
  keyword: string,
  serpData?: Record<string, unknown>
): Promise<IntentClassification> {
  // TODO: Implement full AI-powered intent classification with SERP analysis
  try {
    // Step 1: Rule-based pre-classification
    const keywordLower = keyword.toLowerCase();
    const signalMatches: Partial<Record<SearchIntentType, string[]>> = {};

    for (const [intent, signals] of Object.entries(INTENT_SIGNALS)) {
      const matched = signals.filter((signal) => keywordLower.includes(signal));
      if (matched.length > 0) {
        signalMatches[intent as SearchIntentType] = matched;
      }
    }

    // Step 2: If SERP data available, use it to enhance classification
    if (serpData) {
      // TODO: Analyze SERP features (featured snippets, shopping results, local pack, etc.)
      // to refine intent classification
    }

    // Step 3: If signal-based detection is ambiguous, use AI
    const matchedIntents = Object.keys(signalMatches) as SearchIntentType[];

    if (matchedIntents.length === 0 || matchedIntents.length > 2) {
      // Use AI for ambiguous cases
      try {
        const prompt = `Classify the search intent of this keyword: "${keyword}"
Possible intents: informational, navigational, commercial, transactional, local, generative.
Return JSON: { "intent": "...", "confidence": 0.0-1.0, "signals": ["reason1", "reason2"] }`;

        const response = await generateText(prompt, { maxTokens: 256 });
        const parsed = JSON.parse(response);

        return {
          intent: parsed.intent as SearchIntentType,
          confidence: Number(parsed.confidence),
          signals: Array.isArray(parsed.signals) ? parsed.signals.map(String) : [],
        };
      } catch {
        // Fallback to informational
        return {
          intent: "informational",
          confidence: 0.3,
          signals: ["fallback_classification"],
        };
      }
    }

    // Return the intent with the most signal matches
    const bestIntent = matchedIntents.reduce((best, current) =>
      (signalMatches[current]?.length ?? 0) > (signalMatches[best]?.length ?? 0)
        ? current
        : best
    );

    const matchCount = signalMatches[bestIntent]?.length ?? 0;
    const confidence = Math.min(0.95, 0.5 + matchCount * 0.15);

    return {
      intent: bestIntent,
      confidence,
      signals: signalMatches[bestIntent] ?? [],
    };
  } catch (error) {
    console.error("classifySearchIntent error:", error);
    throw new Error(
      `Failed to classify search intent: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
