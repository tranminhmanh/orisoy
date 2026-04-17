import { generateImage } from "./openai";
import { generateText } from "./claude";

export interface GeneratedImage {
  url: string;
  revisedPrompt: string;
}

export interface FeaturedImageResult {
  url: string;
  altText: string;
}

export async function generateSeoImage(
  prompt: string,
  options?: { style?: string }
): Promise<GeneratedImage> {
  // TODO: Implement with full DALL-E integration and prompt optimization
  try {
    const stylePrefix = options?.style ? `${options.style} style: ` : "";
    const enhancedPrompt = `${stylePrefix}${prompt}. Professional, high-quality, suitable for web content.`;

    const url = await generateImage(enhancedPrompt, {
      size: "1792x1024",
      quality: "hd",
    });

    return {
      url,
      revisedPrompt: enhancedPrompt,
    };
  } catch (error) {
    console.error("generateSeoImage error:", error);
    throw new Error(
      `Failed to generate SEO image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function generateFeaturedImage(
  articleTitle: string,
  keywords: string[]
): Promise<FeaturedImageResult> {
  // TODO: Use AI to create optimized prompt from article title and keywords
  try {
    // Use Claude to generate an optimized DALL-E prompt
    const promptGenerationRequest = `Create a DALL-E image generation prompt for a blog featured image.
Article title: "${articleTitle}"
Keywords: ${keywords.join(", ")}

Requirements:
- Professional and visually appealing
- Relevant to the article topic
- No text in the image
- Suitable as a blog header/featured image

Return only the prompt text, nothing else.`;

    const dallePrompt = await generateText(promptGenerationRequest, {
      maxTokens: 256,
    });

    const url = await generateImage(dallePrompt, {
      size: "1792x1024",
      quality: "hd",
    });

    // Generate SEO-friendly alt text
    const altText = `${articleTitle} - ${keywords.slice(0, 3).join(", ")}`;

    return {
      url,
      altText,
    };
  } catch (error) {
    console.error("generateFeaturedImage error:", error);
    throw new Error(
      `Failed to generate featured image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
