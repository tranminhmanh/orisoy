import { prisma } from "@/lib/prisma";
import { generateText } from "./claude";

export interface ContentBriefData {
  title: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  outline: Array<{ heading: string; subheadings: string[]; notes: string }>;
  targetWordCount: number;
  tone: string;
  audience: string;
  competitorInsights: string[];
  suggestedInternalLinks: string[];
}

export async function generateContentBrief(
  clusterId: string,
  projectId: string
): Promise<ContentBriefData> {
  // TODO: Fetch cluster data from DB and generate brief via AI
  try {
    const cluster = await prisma.keywordCluster.findUnique({
      where: { id: clusterId },
      include: { keywords: true },
    });

    if (!cluster) {
      throw new Error(`Cluster not found: ${clusterId}`);
    }

    const prompt = `Generate a content brief for the keyword cluster: ${cluster.name}. Keywords: ${cluster.keywords.map((k) => k.term).join(", ")}`;
    const rawResponse = await generateText(prompt, { maxTokens: 2048 });

    // TODO: Parse AI response into structured ContentBriefData
    return {
      title: `Article about ${cluster.name}`,
      targetKeyword: cluster.keywords[0]?.term ?? cluster.name,
      secondaryKeywords: cluster.keywords.slice(1).map((k) => k.term),
      outline: [
        {
          heading: "Introduction",
          subheadings: [],
          notes: "Cover the topic overview",
        },
        {
          heading: "Main Content",
          subheadings: ["Subtopic 1", "Subtopic 2"],
          notes: rawResponse.slice(0, 200),
        },
        {
          heading: "Conclusion",
          subheadings: [],
          notes: "Summarize key points",
        },
      ],
      targetWordCount: 1500,
      tone: "informative",
      audience: "general",
      competitorInsights: [],
      suggestedInternalLinks: [],
    };
  } catch (error) {
    console.error("generateContentBrief error:", error);
    throw new Error(
      `Failed to generate content brief: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function generateArticle(
  briefId: string,
  options: { tone: string; wordCount: number; model?: string }
): Promise<string> {
  // TODO: Fetch brief from DB and generate full article
  try {
    const brief = await prisma.contentBrief.findUnique({
      where: { id: briefId },
      include: { article: true },
    });

    if (!brief) {
      throw new Error(`Content brief not found: ${briefId}`);
    }

    const prompt = `Write a ${options.wordCount}-word article with a ${options.tone} tone based on this brief:\nTitle: ${brief.article.title}\nOutline: ${JSON.stringify(brief.outline)}`;

    const article = await generateText(prompt, {
      maxTokens: options.wordCount * 2,
    });

    return article;
  } catch (error) {
    console.error("generateArticle error:", error);
    throw new Error(
      `Failed to generate article: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function refreshArticle(
  articleId: string,
  reason: string
): Promise<string> {
  // TODO: Fetch existing article, analyze what needs refreshing, regenerate
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { brief: true },
    });

    if (!article) {
      throw new Error(`Article not found: ${articleId}`);
    }

    const prompt = `Refresh the following article. Reason for refresh: ${reason}\n\nOriginal article:\n${article.content}`;

    const refreshedContent = await generateText(prompt, {
      maxTokens: 8192,
    });

    return refreshedContent;
  } catch (error) {
    console.error("refreshArticle error:", error);
    throw new Error(
      `Failed to refresh article: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
