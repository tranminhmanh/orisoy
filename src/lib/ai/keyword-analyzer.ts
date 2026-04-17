import { generateText } from "./claude";

export async function suggestKeywords(
  seed: string,
  industry?: string
): Promise<Array<{ term: string; relevance: number; intent: string }>> {
  // TODO: Implement real AI keyword suggestion
  try {
    const industryContext = industry ? ` in the ${industry} industry` : "";
    const prompt = `Suggest 20 related keywords for "${seed}"${industryContext}. For each keyword, provide: term, relevance score (0-1), and search intent (informational, navigational, commercial, transactional, local, generative). Return as JSON array.`;

    const response = await generateText(prompt, { maxTokens: 2048 });

    // TODO: Parse AI response properly
    try {
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed.map((item: Record<string, unknown>) => ({
          term: String(item.term ?? ""),
          relevance: Number(item.relevance ?? 0),
          intent: String(item.intent ?? "informational"),
        }));
      }
    } catch {
      // AI response was not valid JSON
    }

    // Fallback placeholder
    return [
      { term: seed, relevance: 1.0, intent: "informational" },
      { term: `${seed} guide`, relevance: 0.8, intent: "informational" },
      { term: `best ${seed}`, relevance: 0.7, intent: "commercial" },
      { term: `${seed} price`, relevance: 0.6, intent: "transactional" },
    ];
  } catch (error) {
    console.error("suggestKeywords error:", error);
    throw new Error(
      `Failed to suggest keywords: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function classifyIntent(
  keywords: string[]
): Promise<Array<{ keyword: string; intent: string; confidence: number }>> {
  // TODO: Implement real AI intent classification
  try {
    const prompt = `Classify the search intent for each keyword. Intents: informational, navigational, commercial, transactional, local, generative. Return JSON array with keyword, intent, and confidence (0-1).\n\nKeywords:\n${keywords.map((k) => `- ${k}`).join("\n")}`;

    const response = await generateText(prompt, { maxTokens: 2048 });

    try {
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed.map((item: Record<string, unknown>) => ({
          keyword: String(item.keyword ?? ""),
          intent: String(item.intent ?? "informational"),
          confidence: Number(item.confidence ?? 0.5),
        }));
      }
    } catch {
      // AI response was not valid JSON
    }

    // Fallback: assign informational to all
    return keywords.map((keyword) => ({
      keyword,
      intent: "informational",
      confidence: 0.5,
    }));
  } catch (error) {
    console.error("classifyIntent error:", error);
    throw new Error(
      `Failed to classify intent: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function clusterByAi(
  keywords: Array<{ term: string; volume: number }>
): Promise<Array<{ name: string; keywords: string[]; contentType: string }>> {
  // TODO: Implement real AI-powered keyword clustering
  try {
    const prompt = `Group these keywords into topical clusters. For each cluster provide: name, list of keywords, and suggested content type (blog_post, landing_page, guide, comparison, faq, product_page). Return as JSON array.\n\nKeywords:\n${keywords.map((k) => `- ${k.term} (volume: ${k.volume})`).join("\n")}`;

    const response = await generateText(prompt, { maxTokens: 2048 });

    try {
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        return parsed.map((item: Record<string, unknown>) => ({
          name: String(item.name ?? "Unnamed Cluster"),
          keywords: Array.isArray(item.keywords) ? item.keywords.map(String) : [],
          contentType: String(item.contentType ?? "blog_post"),
        }));
      }
    } catch {
      // AI response was not valid JSON
    }

    // Fallback: single cluster with all keywords
    return [
      {
        name: "Main Cluster",
        keywords: keywords.map((k) => k.term),
        contentType: "blog_post",
      },
    ];
  } catch (error) {
    console.error("clusterByAi error:", error);
    throw new Error(
      `Failed to cluster keywords: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
