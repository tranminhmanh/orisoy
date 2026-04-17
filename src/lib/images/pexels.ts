export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographerUrl: string;
  avgColor: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export async function searchPexelsPhotos(
  query: string,
  options?: { page?: number; perPage?: number }
): Promise<PexelsPhoto[]> {
  try {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      throw new Error("Pexels API key not configured");
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
      `https://api.pexels.com/v1/search?${params.toString()}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return (data.photos ?? []).map((photo: Record<string, unknown>) => ({
      id: photo.id ?? 0,
      width: photo.width ?? 0,
      height: photo.height ?? 0,
      url: photo.url ?? "",
      photographer: photo.photographer ?? "",
      photographerUrl: photo.photographer_url ?? "",
      avgColor: photo.avg_color ?? "",
      src: {
        original: (photo.src as Record<string, string>)?.original ?? "",
        large2x: (photo.src as Record<string, string>)?.large2x ?? "",
        large: (photo.src as Record<string, string>)?.large ?? "",
        medium: (photo.src as Record<string, string>)?.medium ?? "",
        small: (photo.src as Record<string, string>)?.small ?? "",
        portrait: (photo.src as Record<string, string>)?.portrait ?? "",
        landscape: (photo.src as Record<string, string>)?.landscape ?? "",
        tiny: (photo.src as Record<string, string>)?.tiny ?? "",
      },
      alt: photo.alt ?? "",
    }));
  } catch (error) {
    console.error("searchPexelsPhotos error:", error);
    throw new Error(
      `Failed to search Pexels photos: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
