import Anthropic from "@anthropic-ai/sdk";

const globalForClaude = globalThis as unknown as {
  claude: Anthropic | undefined;
};

export const claudeClient =
  globalForClaude.claude ??
  new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

if (process.env.NODE_ENV !== "production") globalForClaude.claude = claudeClient;

export async function generateText(
  prompt: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  // TODO: Implement real Claude API call
  try {
    const response = await claudeClient.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: options?.maxTokens ?? 4096,
      temperature: options?.temperature ?? 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.text ?? "";
  } catch (error) {
    console.error("Claude generateText error:", error);
    throw new Error(
      `Failed to generate text: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function* streamText(prompt: string): AsyncGenerator<string> {
  // TODO: Implement real Claude streaming
  try {
    const stream = claudeClient.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  } catch (error) {
    console.error("Claude streamText error:", error);
    throw new Error(
      `Failed to stream text: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
