interface InstagramPublishParams {
  accountId: string;
  imageUrl: string;
  caption: string;
}

interface InstagramPublishResult {
  mediaId: string;
}

export async function publishToInstagram(
  params: InstagramPublishParams
): Promise<InstagramPublishResult> {
  // TODO: Implement real Instagram Graph API call
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Instagram access token not configured");
    }

    // Step 1: Create media container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v19.0/${params.accountId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: params.imageUrl,
          caption: params.caption,
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      throw new Error(
        `Instagram container creation error: ${containerResponse.status} - ${JSON.stringify(errorData)}`
      );
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    if (!containerId) {
      throw new Error("Failed to create media container");
    }

    // Step 2: Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v19.0/${params.accountId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json();
      throw new Error(
        `Instagram publish error: ${publishResponse.status} - ${JSON.stringify(errorData)}`
      );
    }

    const publishData = await publishResponse.json();

    return {
      mediaId: publishData.id ?? "",
    };
  } catch (error) {
    console.error("publishToInstagram error:", error);
    throw new Error(
      `Failed to publish to Instagram: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
