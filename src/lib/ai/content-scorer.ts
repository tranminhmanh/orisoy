import { generateText } from "./claude";

export interface SeoScoreResult {
  total: number;
  keywordOptimization: number;
  nlpCoverage: number;
  structure: number;
  technical: number;
  originality: number;
  suggestions: string[];
}

export interface GeoScoreResult {
  total: number;
  directAnswer: number;
  factDensity: number;
  sourceAuthority: number;
  structuralClarity: number;
  entityRichness: number;
  crossPlatform: number;
  suggestions: string[];
}

export async function calculateSeoScore(
  content: string,
  targetKeyword: string,
  secondaryKeywords: string[]
): Promise<SeoScoreResult> {
  // TODO: Implement real SEO scoring with NLP analysis
  try {
    const contentLower = content.toLowerCase();
    const keywordLower = targetKeyword.toLowerCase();

    // Basic keyword presence check (placeholder logic)
    const keywordCount = (contentLower.match(new RegExp(keywordLower, "g")) || []).length;
    const wordCount = content.split(/\s+/).length;
    const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    const hasH1 = /<h1/i.test(content) || content.startsWith("# ");
    const hasH2 = /<h2/i.test(content) || /^## /m.test(content);

    const secondaryPresent = secondaryKeywords.filter((kw) =>
      contentLower.includes(kw.toLowerCase())
    ).length;
    const secondaryCoverage =
      secondaryKeywords.length > 0
        ? (secondaryPresent / secondaryKeywords.length) * 100
        : 50;

    const keywordOptimization = Math.min(100, keywordDensity > 0 ? 60 + keywordDensity * 10 : 20);
    const nlpCoverage = Math.min(100, secondaryCoverage);
    const structure = (hasH1 ? 40 : 0) + (hasH2 ? 30 : 0) + (wordCount > 300 ? 30 : 15);
    const technical = 50; // TODO: Check meta tags, schema, etc.
    const originality = 70; // TODO: Run plagiarism/uniqueness check

    const total = Math.round(
      keywordOptimization * 0.25 +
        nlpCoverage * 0.2 +
        structure * 0.2 +
        technical * 0.2 +
        originality * 0.15
    );

    const suggestions: string[] = [];
    if (keywordDensity < 0.5) suggestions.push("Increase target keyword usage");
    if (!hasH1) suggestions.push("Add an H1 heading with the target keyword");
    if (!hasH2) suggestions.push("Add H2 subheadings for better structure");
    if (secondaryCoverage < 50) suggestions.push("Include more secondary keywords naturally");
    if (wordCount < 800) suggestions.push("Consider expanding content to at least 800 words");

    return {
      total,
      keywordOptimization: Math.round(keywordOptimization),
      nlpCoverage: Math.round(nlpCoverage),
      structure: Math.round(structure),
      technical,
      originality,
      suggestions,
    };
  } catch (error) {
    console.error("calculateSeoScore error:", error);
    throw new Error(
      `Failed to calculate SEO score: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function calculateGeoScore(
  content: string,
  query: string
): Promise<GeoScoreResult> {
  // TODO: Implement real GEO scoring with AI analysis
  try {
    const prompt = `Analyze this content for AI Engine Optimization (GEO/AEO) citability. Score each dimension 0-100.
Query: "${query}"
Content (first 2000 chars): ${content.slice(0, 2000)}

Score these dimensions:
1. Direct Answer: Does the content directly answer the query?
2. Fact Density: How many verifiable facts per paragraph?
3. Source Authority: Does it cite authoritative sources?
4. Structural Clarity: Is it well-structured with clear headings?
5. Entity Richness: How many named entities are mentioned?
6. Cross-Platform: Would different AI engines cite this?

Return JSON with scores.`;

    const response = await generateText(prompt, { maxTokens: 1024 });

    // TODO: Parse AI response for actual scores
    // Placeholder scoring
    const wordCount = content.split(/\s+/).length;

    const directAnswer = content.toLowerCase().includes(query.toLowerCase()) ? 70 : 30;
    const factDensity = Math.min(100, wordCount > 500 ? 60 : 30);
    const sourceAuthority = 50; // TODO: Check citations
    const structuralClarity = /<h[1-6]/i.test(content) ? 70 : 40;
    const entityRichness = 50; // TODO: NER analysis
    const crossPlatform = 50; // TODO: Multi-engine simulation

    const total = Math.round(
      directAnswer * 0.2 +
        factDensity * 0.18 +
        sourceAuthority * 0.18 +
        structuralClarity * 0.16 +
        entityRichness * 0.14 +
        crossPlatform * 0.14
    );

    const suggestions: string[] = [];
    if (directAnswer < 60) suggestions.push("Add a direct, concise answer near the top of content");
    if (factDensity < 60) suggestions.push("Include more verifiable facts and statistics");
    if (sourceAuthority < 60) suggestions.push("Cite authoritative sources and studies");
    if (structuralClarity < 60) suggestions.push("Improve structure with clear headings and lists");
    if (entityRichness < 60) suggestions.push("Mention more named entities (people, organizations, places)");

    return {
      total,
      directAnswer,
      factDensity,
      sourceAuthority,
      structuralClarity,
      entityRichness,
      crossPlatform,
      suggestions,
    };
  } catch (error) {
    console.error("calculateGeoScore error:", error);
    throw new Error(
      `Failed to calculate GEO score: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
