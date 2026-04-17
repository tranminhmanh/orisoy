export interface WpPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: "publish" | "draft" | "pending" | "private";
  link: string;
}

export interface WpCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WpTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WpMediaUpload {
  id: number;
  url: string;
  title: string;
  altText: string;
}

interface WordPressConfig {
  siteUrl: string;
  username: string;
  applicationPassword: string;
}

export class WordPressClient {
  private config: WordPressConfig;

  constructor(config: WordPressConfig) {
    this.config = config;
  }

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(`${this.config.username}:${this.config.applicationPassword}`).toString("base64")}`;
  }

  private get apiBase(): string {
    const base = this.config.siteUrl.replace(/\/$/, "");
    return `${base}/wp-json/wp/v2`;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.apiBase}${endpoint}`, {
        ...options,
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `WordPress API error: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("WordPress request error:", error);
      throw new Error(
        `WordPress request failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async createPost(params: {
    title: string;
    content: string;
    status?: "publish" | "draft" | "pending" | "private";
    slug?: string;
    categories?: number[];
    tags?: number[];
    featuredMediaId?: number;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
  }): Promise<WpPost> {
    return this.request<WpPost>("/posts", {
      method: "POST",
      body: JSON.stringify({
        title: params.title,
        content: params.content,
        status: params.status ?? "draft",
        slug: params.slug,
        categories: params.categories,
        tags: params.tags,
        featured_media: params.featuredMediaId,
        excerpt: params.excerpt,
        meta: {
          _yoast_wpseo_title: params.metaTitle,
          _yoast_wpseo_metadesc: params.metaDescription,
        },
      }),
    });
  }

  async updatePost(
    postId: number,
    params: {
      title?: string;
      content?: string;
      status?: "publish" | "draft" | "pending" | "private";
      slug?: string;
      categories?: number[];
      tags?: number[];
      featuredMediaId?: number;
      excerpt?: string;
    }
  ): Promise<WpPost> {
    return this.request<WpPost>(`/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: params.title,
        content: params.content,
        status: params.status,
        slug: params.slug,
        categories: params.categories,
        tags: params.tags,
        featured_media: params.featuredMediaId,
        excerpt: params.excerpt,
      }),
    });
  }

  async uploadMedia(params: {
    file: Buffer;
    filename: string;
    mimeType: string;
    title?: string;
    altText?: string;
    caption?: string;
  }): Promise<WpMediaUpload> {
    try {
      const response = await fetch(`${this.apiBase}/media`, {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Disposition": `attachment; filename="${params.filename}"`,
          "Content-Type": params.mimeType,
        },
        body: params.file,
      });

      if (!response.ok) {
        throw new Error(`WordPress media upload error: ${response.status}`);
      }

      const media = (await response.json()) as Record<string, unknown>;
      const mediaId = media.id as number;

      // Update alt text and title if provided
      if (params.altText || params.title) {
        await this.request(`/media/${mediaId}`, {
          method: "PUT",
          body: JSON.stringify({
            alt_text: params.altText ?? "",
            title: params.title ?? params.filename,
            caption: params.caption ?? "",
          }),
        });
      }

      return {
        id: mediaId,
        url: (media.source_url as string) ?? "",
        title: params.title ?? params.filename,
        altText: params.altText ?? "",
      };
    } catch (error) {
      console.error("WordPress uploadMedia error:", error);
      throw new Error(
        `Failed to upload media: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async getCategories(params?: {
    search?: string;
    perPage?: number;
  }): Promise<WpCategory[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    searchParams.set("per_page", String(params?.perPage ?? 100));

    return this.request<WpCategory[]>(`/categories?${searchParams.toString()}`);
  }

  async getTags(params?: {
    search?: string;
    perPage?: number;
  }): Promise<WpTag[]> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    searchParams.set("per_page", String(params?.perPage ?? 100));

    return this.request<WpTag[]>(`/tags?${searchParams.toString()}`);
  }
}
