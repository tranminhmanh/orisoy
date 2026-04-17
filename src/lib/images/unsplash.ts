export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  description: string | null;
  altDescription: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    portfolioUrl: string | null;
  };
  downloadUrl: string;
}

export async function searchUnsplashPhotos(
  query: string,
  options?: { page?: number; perPage?: number }
): Promise<UnsplashPhoto[]> {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error("Unsplash access key not configured");
    }

    const page = options?.page ?? 1;
    const perPage = options?.perPage ?? 10;

    const params = new URLSearchParams({
      query,
      page: String(page),
      per_page: String(perPage),
      orientation: "landscape",
    });

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return (data.results ?? []).map((photo: Record<string, unknown>) => ({
      id: photo.id ?? "",
      width: photo.width ?? 0,
      height: photo.height ?? 0,
      description: photo.description ?? null,
      altDescription: photo.alt_description ?? null,
      urls: {
        raw: (photo.urls as Record<string, string>)?.raw ?? "",
        full: (photo.urls as Record<string, string>)?.full ?? "",
        regular: (photo.urls as Record<string, string>)?.regular ?? "",
        small: (photo.urls as Record<string, string>)?.small ?? "",
        thumb: (photo.urls as Record<string, string>)?.thumb ?? "",
      },
      user: {
        name: (photo.user as Record<string, unknown>)?.name ?? "",
        username: (photo.user as Record<string, unknown>)?.username ?? "",
        portfolioUrl: (photo.user as Record<string, unknown>)?.portfolio_url ?? null,
      },
      downloadUrl: (photo.links as Record<string, string>)?.download ?? "",
    }));
  } catch (error) {
    console.error("searchUnsplashPhotos error:", error);
    throw new Error(
      `Failed to search Unsplash photos: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
