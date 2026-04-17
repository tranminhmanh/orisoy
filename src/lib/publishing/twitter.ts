interface TwitterPublishParams {
  text: string;
  mediaIds?: string[];
}

interface TwitterPublishResult {
  tweetId: string;
}

export async function publishToTwitter(
  params: TwitterPublishParams
): Promise<TwitterPublishResult> {
  // TODO: Implement real Twitter API v2 call with OAuth 2.0
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;

    if (!accessToken) {
      throw new Error("Twitter access token not configured");
    }

    // Build tweet payload
    const tweetPayload: Record<string, unknown> = {
      text: params.text,
    };

    if (params.mediaIds && params.mediaIds.length > 0) {
      tweetPayload.media = {
        media_ids: params.mediaIds,
      };
    }

    // TODO: Implement proper OAuth 1.0a signing for Twitter API v2
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken ?? accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tweetPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Twitter API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    return {
      tweetId: data.data?.id ?? "",
    };
  } catch (error) {
    console.error("publishToTwitter error:", error);
    throw new Error(
      `Failed to publish to Twitter: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
