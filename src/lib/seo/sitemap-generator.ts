interface _SitemapUrl {
  loc: string;
  lastmod?: string;
  priority?: number;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

export function generateSitemap(
  domain: string,
  urls: Array<{ loc: string; lastmod?: string; priority?: number }>
): string {
  try {
    const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;

    const urlEntries = urls
      .map((entry) => {
        const loc = entry.loc.startsWith("http")
          ? entry.loc
          : `${baseUrl}${entry.loc.startsWith("/") ? "" : "/"}${entry.loc}`;

        const parts = [`    <loc>${escapeXml(loc)}</loc>`];

        if (entry.lastmod) {
          parts.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
        }

        if (entry.priority !== undefined) {
          parts.push(`    <priority>${Math.max(0, Math.min(1, entry.priority)).toFixed(1)}</priority>`);
        }

        return `  <url>\n${parts.join("\n")}\n  </url>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  } catch (error) {
    console.error("generateSitemap error:", error);
    throw new Error(
      `Failed to generate sitemap: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
