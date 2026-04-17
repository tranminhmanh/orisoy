import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

export const openaiClient =
  globalForOpenAI.openai ??
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

if (process.env.NODE_ENV !== "production") globalForOpenAI.openai = openaiClient;

export async function generateImage(
  prompt: string,
  options?: { size?: string; quality?: string }
): Promise<string> {
  // TODO: Implement real DALL-E API call
  try {
    const response = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: (options?.size as "1024x1024" | "1792x1024" | "1024x1792") ?? "1024x1024",
      quality: (options?.quality as "standard" | "hd") ?? "standard",
    });

    const url = response.data?.[0]?.url;
    if (!url) {
      throw new Error("No image URL returned from OpenAI");
    }

    return url;
  } catch (error) {
    console.error("OpenAI generateImage error:", error);
    throw new Error(
      `Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
