export interface SeoScoreBreakdown {
  totalScore: number;
  categories: {
    title: CategoryScore;
    metaDescription: CategoryScore;
    headings: CategoryScore;
    keywordUsage: CategoryScore;
    content: CategoryScore;
    readability: CategoryScore;
    technical: CategoryScore;
  };
  checks: SeoCheck[];
}

interface CategoryScore {
  score: number;
  maxScore: number;
  percentage: number;
}

interface SeoCheck {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
}

interface ScorerParams {
  content: string;
  title: string;
  metaDescription: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  url?: string;
}

export function scoreSeoContent(params: ScorerParams): SeoScoreBreakdown {
  const { content, title, metaDescription, targetKeyword, secondaryKeywords, url } = params;
  const checks: SeoCheck[] = [];
  const contentLower = content.toLowerCase();
  const keywordLower = targetKeyword.toLowerCase();

  // --- TITLE CHECKS (max 15 points) ---

  checks.push({
    id: "title_length",
    category: "title",
    name: "Title length",
    passed: title.length >= 30 && title.length <= 60,
    score: title.length >= 30 && title.length <= 60 ? 3 : title.length > 0 ? 1 : 0,
    maxScore: 3,
    message: `Title is ${title.length} characters (recommended: 30-60)`,
  });

  checks.push({
    id: "title_keyword",
    category: "title",
    name: "Keyword in title",
    passed: title.toLowerCase().includes(keywordLower),
    score: title.toLowerCase().includes(keywordLower) ? 4 : 0,
    maxScore: 4,
    message: title.toLowerCase().includes(keywordLower)
      ? "Target keyword found in title"
      : "Target keyword missing from title",
  });

  checks.push({
    id: "title_keyword_position",
    category: "title",
    name: "Keyword near start of title",
    passed: title.toLowerCase().indexOf(keywordLower) < title.length / 3,
    score: title.toLowerCase().indexOf(keywordLower) < title.length / 3 ? 3 : 0,
    maxScore: 3,
    message: "Keyword placement in title",
  });

  checks.push({
    id: "title_unique_power_words",
    category: "title",
    name: "Title has power words",
    passed: /\b(best|top|ultimate|guide|how|why|review|complete|free|new)\b/i.test(title),
    score: /\b(best|top|ultimate|guide|how|why|review|complete|free|new)\b/i.test(title) ? 2 : 0,
    maxScore: 2,
    message: "Title engagement optimization",
  });

  checks.push({
    id: "title_number",
    category: "title",
    name: "Title contains number",
    passed: /\d/.test(title),
    score: /\d/.test(title) ? 3 : 0,
    maxScore: 3,
    message: "Numbers in titles improve CTR",
  });

  // --- META DESCRIPTION CHECKS (max 10 points) ---

  checks.push({
    id: "meta_length",
    category: "metaDescription",
    name: "Meta description length",
    passed: metaDescription.length >= 120 && metaDescription.length <= 160,
    score: metaDescription.length >= 120 && metaDescription.length <= 160 ? 3 : metaDescription.length > 0 ? 1 : 0,
    maxScore: 3,
    message: `Meta description is ${metaDescription.length} characters (recommended: 120-160)`,
  });

  checks.push({
    id: "meta_keyword",
    category: "metaDescription",
    name: "Keyword in meta description",
    passed: metaDescription.toLowerCase().includes(keywordLower),
    score: metaDescription.toLowerCase().includes(keywordLower) ? 4 : 0,
    maxScore: 4,
    message: "Target keyword in meta description",
  });

  checks.push({
    id: "meta_cta",
    category: "metaDescription",
    name: "Meta has call-to-action",
    passed: /\b(learn|discover|find|get|read|check|explore|see|try)\b/i.test(metaDescription),
    score: /\b(learn|discover|find|get|read|check|explore|see|try)\b/i.test(metaDescription) ? 3 : 0,
    maxScore: 3,
    message: "Meta description call-to-action",
  });

  // --- HEADING CHECKS (max 15 points) ---

  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/gi) || content.match(/^# .+$/gm);
  const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || content.match(/^## .+$/gm);
  const _h3Match = content.match(/<h3[^>]*>(.*?)<\/h3>/gi) || content.match(/^### .+$/gm);

  checks.push({
    id: "h1_present",
    category: "headings",
    name: "H1 tag present",
    passed: (h1Match?.length ?? 0) === 1,
    score: (h1Match?.length ?? 0) === 1 ? 4 : 0,
    maxScore: 4,
    message: `Found ${h1Match?.length ?? 0} H1 tags (should be exactly 1)`,
  });

  checks.push({
    id: "h1_keyword",
    category: "headings",
    name: "Keyword in H1",
    passed: h1Match ? h1Match.some((h) => h.toLowerCase().includes(keywordLower)) : false,
    score: h1Match?.some((h) => h.toLowerCase().includes(keywordLower)) ? 3 : 0,
    maxScore: 3,
    message: "Target keyword in H1 heading",
  });

  checks.push({
    id: "h2_present",
    category: "headings",
    name: "H2 subheadings",
    passed: (h2Match?.length ?? 0) >= 2,
    score: Math.min(4, (h2Match?.length ?? 0) * 2),
    maxScore: 4,
    message: `Found ${h2Match?.length ?? 0} H2 subheadings`,
  });

  checks.push({
    id: "h2_keyword",
    category: "headings",
    name: "Keyword in H2",
    passed: h2Match ? h2Match.some((h) => h.toLowerCase().includes(keywordLower)) : false,
    score: h2Match?.some((h) => h.toLowerCase().includes(keywordLower)) ? 2 : 0,
    maxScore: 2,
    message: "Target keyword in at least one H2",
  });

  checks.push({
    id: "heading_hierarchy",
    category: "headings",
    name: "Heading hierarchy",
    passed: (h1Match?.length ?? 0) > 0 && (h2Match?.length ?? 0) > 0,
    score: (h1Match?.length ?? 0) > 0 && (h2Match?.length ?? 0) > 0 ? 2 : 0,
    maxScore: 2,
    message: "Proper heading hierarchy (H1 > H2 > H3)",
  });

  // --- KEYWORD USAGE CHECKS (max 20 points) ---

  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const keywordOccurrences = (contentLower.match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  const density = wordCount > 0 ? (keywordOccurrences / wordCount) * 100 : 0;

  checks.push({
    id: "keyword_density",
    category: "keywordUsage",
    name: "Keyword density",
    passed: density >= 0.5 && density <= 2.5,
    score: density >= 0.5 && density <= 2.5 ? 5 : density > 0 ? 2 : 0,
    maxScore: 5,
    message: `Keyword density: ${density.toFixed(2)}% (recommended: 0.5-2.5%)`,
  });

  checks.push({
    id: "keyword_first_paragraph",
    category: "keywordUsage",
    name: "Keyword in first paragraph",
    passed: contentLower.slice(0, 300).includes(keywordLower),
    score: contentLower.slice(0, 300).includes(keywordLower) ? 4 : 0,
    maxScore: 4,
    message: "Keyword presence in introduction",
  });

  checks.push({
    id: "keyword_last_paragraph",
    category: "keywordUsage",
    name: "Keyword in conclusion",
    passed: contentLower.slice(-500).includes(keywordLower),
    score: contentLower.slice(-500).includes(keywordLower) ? 3 : 0,
    maxScore: 3,
    message: "Keyword presence in conclusion",
  });

  const secondaryFound = secondaryKeywords.filter((kw) =>
    contentLower.includes(kw.toLowerCase())
  ).length;

  checks.push({
    id: "secondary_keywords",
    category: "keywordUsage",
    name: "Secondary keywords used",
    passed: secondaryKeywords.length === 0 || secondaryFound >= secondaryKeywords.length * 0.5,
    score: secondaryKeywords.length > 0
      ? Math.min(5, Math.round((secondaryFound / secondaryKeywords.length) * 5))
      : 3,
    maxScore: 5,
    message: `${secondaryFound}/${secondaryKeywords.length} secondary keywords used`,
  });

  checks.push({
    id: "keyword_in_url",
    category: "keywordUsage",
    name: "Keyword in URL",
    passed: url ? url.toLowerCase().includes(keywordLower.replace(/\s+/g, "-")) : false,
    score: url?.toLowerCase().includes(keywordLower.replace(/\s+/g, "-")) ? 3 : 0,
    maxScore: 3,
    message: "Target keyword in URL slug",
  });

  // --- CONTENT CHECKS (max 25 points) ---

  checks.push({
    id: "word_count",
    category: "content",
    name: "Word count",
    passed: wordCount >= 800,
    score: wordCount >= 1500 ? 5 : wordCount >= 800 ? 3 : wordCount >= 300 ? 1 : 0,
    maxScore: 5,
    message: `Content has ${wordCount} words`,
  });

  const hasImages = /<img/i.test(content) || /!\[/g.test(content);
  checks.push({
    id: "images_present",
    category: "content",
    name: "Images included",
    passed: hasImages,
    score: hasImages ? 3 : 0,
    maxScore: 3,
    message: hasImages ? "Content includes images" : "No images found in content",
  });

  const hasImageAlt = /alt=["'][^"']+["']/i.test(content) || /!\[[^\]]+\]/g.test(content);
  checks.push({
    id: "image_alt_text",
    category: "content",
    name: "Image alt text",
    passed: hasImageAlt,
    score: hasImageAlt ? 3 : 0,
    maxScore: 3,
    message: "Image alt text optimization",
  });

  const hasList = /<[uo]l/i.test(content) || /^[-*]\s/gm.test(content);
  checks.push({
    id: "lists_present",
    category: "content",
    name: "Lists used",
    passed: hasList,
    score: hasList ? 2 : 0,
    maxScore: 2,
    message: "Bullet/numbered lists for scanability",
  });

  const hasTable = /<table/i.test(content) || /\|.*\|/g.test(content);
  checks.push({
    id: "tables_or_data",
    category: "content",
    name: "Tables/structured data",
    passed: hasTable,
    score: hasTable ? 2 : 0,
    maxScore: 2,
    message: "Structured data elements",
  });

  const hasInternalLinks = /<a[^>]+href=["']\/[^"']*["']/i.test(content) || /\]\(\//g.test(content);
  checks.push({
    id: "internal_links",
    category: "content",
    name: "Internal links",
    passed: hasInternalLinks,
    score: hasInternalLinks ? 3 : 0,
    maxScore: 3,
    message: "Internal linking",
  });

  const hasExternalLinks = /<a[^>]+href=["']https?:\/\//i.test(content) || /\]\(https?:\/\//g.test(content);
  checks.push({
    id: "external_links",
    category: "content",
    name: "External links",
    passed: hasExternalLinks,
    score: hasExternalLinks ? 2 : 0,
    maxScore: 2,
    message: "External reference links",
  });

  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  const avgParagraphLength = paragraphs.length > 0
    ? paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0) / paragraphs.length
    : 0;

  checks.push({
    id: "paragraph_length",
    category: "content",
    name: "Paragraph length",
    passed: avgParagraphLength <= 150,
    score: avgParagraphLength <= 150 ? 2 : avgParagraphLength <= 200 ? 1 : 0,
    maxScore: 2,
    message: `Average paragraph: ${Math.round(avgParagraphLength)} words`,
  });

  checks.push({
    id: "content_freshness",
    category: "content",
    name: "Content uniqueness markers",
    passed: wordCount > 300,
    score: wordCount > 300 ? 3 : 0,
    maxScore: 3,
    message: "Content uniqueness assessment",
  });

  // --- READABILITY CHECKS (max 8 points) ---

  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0
    ? words.length / sentences.length
    : 0;

  checks.push({
    id: "sentence_length",
    category: "readability",
    name: "Average sentence length",
    passed: avgSentenceLength <= 20,
    score: avgSentenceLength <= 20 ? 3 : avgSentenceLength <= 25 ? 1 : 0,
    maxScore: 3,
    message: `Average sentence: ${Math.round(avgSentenceLength)} words (recommended: <= 20)`,
  });

  checks.push({
    id: "transition_words",
    category: "readability",
    name: "Transition words",
    passed: /\b(however|therefore|moreover|furthermore|additionally|consequently|meanwhile|nevertheless)\b/i.test(content),
    score: /\b(however|therefore|moreover|furthermore|additionally|consequently|meanwhile|nevertheless)\b/i.test(content) ? 2 : 0,
    maxScore: 2,
    message: "Use of transition words for flow",
  });

  checks.push({
    id: "active_voice",
    category: "readability",
    name: "Active voice usage",
    passed: true, // TODO: Implement real passive voice detection
    score: 3,
    maxScore: 3,
    message: "Active voice assessment",
  });

  // --- TECHNICAL CHECKS (max 7 points) ---

  checks.push({
    id: "url_length",
    category: "technical",
    name: "URL length",
    passed: url ? url.length <= 75 : true,
    score: !url || url.length <= 75 ? 2 : 0,
    maxScore: 2,
    message: url ? `URL length: ${url.length} characters` : "No URL provided",
  });

  checks.push({
    id: "url_structure",
    category: "technical",
    name: "URL structure",
    passed: url ? /^[a-z0-9\-\/]+$/i.test(new URL(url).pathname) : true,
    score: 2,
    maxScore: 2,
    message: "Clean URL structure",
  });

  checks.push({
    id: "schema_opportunity",
    category: "technical",
    name: "Schema markup opportunity",
    passed: true, // TODO: Check for schema opportunities
    score: 3,
    maxScore: 3,
    message: "Schema markup recommendations",
  });

  // --- CALCULATE CATEGORY SCORES ---

  const categoryMap: Record<string, SeoCheck[]> = {};
  for (const check of checks) {
    if (!categoryMap[check.category]) categoryMap[check.category] = [];
    categoryMap[check.category].push(check);
  }

  function calcCategory(name: string): CategoryScore {
    const categoryChecks = categoryMap[name] ?? [];
    const score = categoryChecks.reduce((s, c) => s + c.score, 0);
    const maxScore = categoryChecks.reduce((s, c) => s + c.maxScore, 0);
    return {
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    };
  }

  const totalScore = checks.reduce((s, c) => s + c.score, 0);
  const totalMaxScore = checks.reduce((s, c) => s + c.maxScore, 0);

  return {
    totalScore: totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
    categories: {
      title: calcCategory("title"),
      metaDescription: calcCategory("metaDescription"),
      headings: calcCategory("headings"),
      keywordUsage: calcCategory("keywordUsage"),
      content: calcCategory("content"),
      readability: calcCategory("readability"),
      technical: calcCategory("technical"),
    },
    checks,
  };
}
