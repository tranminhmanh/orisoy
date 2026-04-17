import { generateText } from "@/lib/ai/claude";

export interface CitabilityScore {
  total: number;
  factDensity: number;
  directAnswer: number;
  sourceAuthority: number;
  structuralClarity: number;
  entityDensity: number;
  semanticUniqueness: number;
  crossPlatform: number;
}

interface AnalysisContext {
  content: string;
  query: string;
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  headingCount: number;
}

function buildContext(content: string, query: string): AnalysisContext {
  const words = content.split(/\s+/).filter(Boolean);
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const headings = (content.match(/<h[1-6][^>]*>|^#{1,6}\s/gm) || []);

  return {
    content,
    query,
    wordCount: words.length,
    paragraphCount: paragraphs.length,
    sentenceCount: sentences.length,
    headingCount: headings.length,
  };
}

function scoreFactDensity(ctx: AnalysisContext): number {
  // TODO: Implement real fact detection using NER and claim extraction
  const numberMatches = ctx.content.match(/\d+([.,]\d+)?%?/g) || [];
  const yearMatches = ctx.content.match(/\b(19|20)\d{2}\b/g) || [];
  const citationMatches = ctx.content.match(/\b(according to|source:|study|research|report|survey)\b/gi) || [];

  const factIndicators = numberMatches.length + yearMatches.length + citationMatches.length;
  const factsPerParagraph = ctx.paragraphCount > 0 ? factIndicators / ctx.paragraphCount : 0;

  if (factsPerParagraph >= 3) return 95;
  if (factsPerParagraph >= 2) return 80;
  if (factsPerParagraph >= 1) return 60;
  if (factsPerParagraph >= 0.5) return 40;
  return 20;
}

function scoreDirectAnswer(ctx: AnalysisContext): number {
  // TODO: Implement real direct answer detection
  const queryTerms = ctx.query.toLowerCase().split(/\s+/);
  const firstParagraph = ctx.content.split(/\n\s*\n/)[0]?.toLowerCase() ?? "";
  const first300 = ctx.content.slice(0, 300).toLowerCase();

  const termsInFirst300 = queryTerms.filter((t) => first300.includes(t)).length;
  const termCoverage = queryTerms.length > 0 ? termsInFirst300 / queryTerms.length : 0;

  // Check for direct answer patterns
  const hasDefinition = /\bis\b|\bare\b|\bmeans\b|\brefers to\b|\bla\b/i.test(firstParagraph);
  const isShortFirst = firstParagraph.split(/\s+/).length <= 50;

  let score = termCoverage * 50;
  if (hasDefinition) score += 25;
  if (isShortFirst && termCoverage > 0.5) score += 25;

  return Math.min(100, Math.round(score));
}

function scoreSourceAuthority(ctx: AnalysisContext): number {
  // TODO: Implement real source authority scoring
  const citations = (ctx.content.match(/\b(according to|cited by|source:|published in|reported by)\b/gi) || []).length;
  const links = (ctx.content.match(/https?:\/\/[^\s]+/g) || []).length;
  const quotations = (ctx.content.match(/"[^"]{10,}"/g) || []).length;

  const authoritySignals = citations + links + quotations;

  if (authoritySignals >= 10) return 90;
  if (authoritySignals >= 5) return 70;
  if (authoritySignals >= 2) return 50;
  if (authoritySignals >= 1) return 30;
  return 15;
}

function scoreStructuralClarity(ctx: AnalysisContext): number {
  // TODO: Implement real structural analysis
  let score = 0;

  // Headings
  if (ctx.headingCount >= 5) score += 25;
  else if (ctx.headingCount >= 3) score += 20;
  else if (ctx.headingCount >= 1) score += 10;

  // Lists
  const hasList = /<[uo]l|^[-*]\s/m.test(ctx.content);
  if (hasList) score += 20;

  // Short paragraphs (good for AI extraction)
  const avgParaLength = ctx.wordCount / Math.max(1, ctx.paragraphCount);
  if (avgParaLength <= 80) score += 20;
  else if (avgParaLength <= 120) score += 10;

  // Tables
  if (/<table|^\|/m.test(ctx.content)) score += 15;

  // Bold/emphasis for key points
  if (/<(strong|b|em)>|\*\*|\*[^*]/i.test(ctx.content)) score += 10;

  // Conclusion or summary section
  if (/\b(summary|conclusion|key takeaway|tom tat|ket luan)\b/i.test(ctx.content)) score += 10;

  return Math.min(100, score);
}

function scoreEntityDensity(ctx: AnalysisContext): number {
  // TODO: Implement real NER for entity extraction
  // Simplified: look for capitalized words, proper nouns, brand names
  const capitalizedWords = ctx.content.match(/\b[A-Z][a-z]{2,}\b/g) || [];
  const uniqueEntities = new Set(capitalizedWords).size;
  const entityDensity = ctx.sentenceCount > 0 ? uniqueEntities / ctx.sentenceCount : 0;

  if (entityDensity >= 2) return 90;
  if (entityDensity >= 1) return 70;
  if (entityDensity >= 0.5) return 50;
  if (entityDensity > 0) return 30;
  return 10;
}

function scoreSemanticUniqueness(ctx: AnalysisContext): number {
  // TODO: Implement real semantic uniqueness with embeddings comparison
  // Simplified: check vocabulary diversity
  const words = ctx.content.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const uniqueWords = new Set(words).size;
  const diversity = words.length > 0 ? uniqueWords / words.length : 0;

  if (diversity >= 0.7) return 90;
  if (diversity >= 0.5) return 70;
  if (diversity >= 0.35) return 50;
  return 30;
}

function scoreCrossPlatform(_ctx: AnalysisContext): number {
  // TODO: Implement real cross-platform simulation (ChatGPT, Gemini, Perplexity, etc.)
  // This requires running actual AI engine simulations
  return 50; // Placeholder - requires simulation engine
}

export async function calculateCitabilityScore(
  content: string,
  query: string
): Promise<CitabilityScore> {
  try {
    const ctx = buildContext(content, query);

    const factDensity = scoreFactDensity(ctx);
    const directAnswer = scoreDirectAnswer(ctx);
    const sourceAuthority = scoreSourceAuthority(ctx);
    const structuralClarity = scoreStructuralClarity(ctx);
    const entityDensity = scoreEntityDensity(ctx);
    const semanticUniqueness = scoreSemanticUniqueness(ctx);
    const crossPlatform = scoreCrossPlatform(ctx);

    // Weighted total score
    const total = Math.round(
      factDensity * 0.18 +
        directAnswer * 0.2 +
        sourceAuthority * 0.15 +
        structuralClarity * 0.15 +
        entityDensity * 0.12 +
        semanticUniqueness * 0.1 +
        crossPlatform * 0.1
    );

    return {
      total,
      factDensity,
      directAnswer,
      sourceAuthority,
      structuralClarity,
      entityDensity,
      semanticUniqueness,
      crossPlatform,
    };
  } catch (error) {
    console.error("calculateCitabilityScore error:", error);
    throw new Error(
      `Failed to calculate citability score: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
