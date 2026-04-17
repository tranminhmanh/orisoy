type SchemaType =
  | "Article"
  | "BlogPosting"
  | "FAQPage"
  | "HowTo"
  | "Product"
  | "LocalBusiness"
  | "Organization"
  | "WebPage"
  | "BreadcrumbList"
  | "VideoObject"
  | "Review";

interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
}

const SCHEMA_TEMPLATES: Record<string, (url: string, data: Record<string, unknown>) => Record<string, unknown>> = {
  Article: (url, data) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title ?? "",
    description: data.description ?? "",
    image: data.image ?? "",
    author: {
      "@type": data.authorType ?? "Person",
      name: data.author ?? "",
    },
    publisher: {
      "@type": "Organization",
      name: data.publisher ?? "",
      logo: {
        "@type": "ImageObject",
        url: data.publisherLogo ?? "",
      },
    },
    datePublished: data.datePublished ?? "",
    dateModified: data.dateModified ?? data.datePublished ?? "",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }),

  BlogPosting: (url, data) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title ?? "",
    description: data.description ?? "",
    image: data.image ?? "",
    author: {
      "@type": "Person",
      name: data.author ?? "",
    },
    datePublished: data.datePublished ?? "",
    dateModified: data.dateModified ?? "",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    wordCount: data.wordCount ?? 0,
    keywords: data.keywords ?? "",
  }),

  FAQPage: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Array.isArray(data.questions)
      ? (data.questions as Array<{ question: string; answer: string }>).map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        }))
      : [],
  }),

  HowTo: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.title ?? "",
    description: data.description ?? "",
    totalTime: data.totalTime ?? "",
    step: Array.isArray(data.steps)
      ? (data.steps as Array<{ name: string; text: string; image?: string }>).map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
          image: s.image ?? "",
        }))
      : [],
  }),

  Product: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name ?? "",
    description: data.description ?? "",
    image: data.image ?? "",
    brand: { "@type": "Brand", name: data.brand ?? "" },
    offers: {
      "@type": "Offer",
      price: data.price ?? 0,
      priceCurrency: data.currency ?? "VND",
      availability: data.availability ?? "https://schema.org/InStock",
    },
    aggregateRating: data.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: (data.rating as Record<string, unknown>).value,
          reviewCount: (data.rating as Record<string, unknown>).count,
        }
      : undefined,
  }),

  LocalBusiness: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": data.businessType ?? "LocalBusiness",
    name: data.name ?? "",
    description: data.description ?? "",
    telephone: data.phone ?? "",
    address: {
      "@type": "PostalAddress",
      streetAddress: data.street ?? "",
      addressLocality: data.city ?? "",
      addressRegion: data.region ?? "",
      postalCode: data.postalCode ?? "",
      addressCountry: data.country ?? "VN",
    },
    geo: data.lat
      ? {
          "@type": "GeoCoordinates",
          latitude: data.lat,
          longitude: data.lng,
        }
      : undefined,
    openingHours: data.openingHours ?? "",
  }),

  Organization: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name ?? "",
    url: data.url ?? "",
    logo: data.logo ?? "",
    sameAs: data.socialLinks ?? [],
    contactPoint: data.phone
      ? {
          "@type": "ContactPoint",
          telephone: data.phone,
          contactType: "customer service",
        }
      : undefined,
  }),

  WebPage: (url, data) => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.title ?? "",
    description: data.description ?? "",
    url,
    isPartOf: { "@type": "WebSite", name: data.siteName ?? "" },
  }),

  BreadcrumbList: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: Array.isArray(data.items)
      ? (data.items as Array<{ name: string; url: string }>).map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        }))
      : [],
  }),

  VideoObject: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: data.title ?? "",
    description: data.description ?? "",
    thumbnailUrl: data.thumbnail ?? "",
    uploadDate: data.uploadDate ?? "",
    duration: data.duration ?? "",
    contentUrl: data.contentUrl ?? "",
    embedUrl: data.embedUrl ?? "",
  }),

  Review: (_url, data) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": (data.reviewedType as string) ?? "Product",
      name: data.reviewedName ?? "",
    },
    author: { "@type": "Person", name: data.author ?? "" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: data.rating ?? 0,
      bestRating: data.bestRating ?? 5,
    },
    reviewBody: data.body ?? "",
    datePublished: data.datePublished ?? "",
  }),
};

export function generateSchema(
  url: string,
  type: string,
  data: Record<string, unknown>
): string {
  try {
    const templateFn = SCHEMA_TEMPLATES[type];

    if (!templateFn) {
      // Generic schema generation for unsupported types
      return JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": type,
          url,
          ...data,
        },
        null,
        2
      );
    }

    const schema = templateFn(url, data);

    // Remove undefined values
    const cleaned = JSON.parse(JSON.stringify(schema));

    return JSON.stringify(cleaned, null, 2);
  } catch (error) {
    console.error("generateSchema error:", error);
    throw new Error(
      `Failed to generate schema: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export function validateSchema(jsonLd: string): SchemaValidationResult {
  const errors: string[] = [];

  try {
    const parsed = JSON.parse(jsonLd);

    // Check required fields
    if (!parsed["@context"]) {
      errors.push("Missing @context property");
    } else if (parsed["@context"] !== "https://schema.org") {
      errors.push("@context should be 'https://schema.org'");
    }

    if (!parsed["@type"]) {
      errors.push("Missing @type property");
    }

    // Type-specific validation
    if (parsed["@type"] === "Article" || parsed["@type"] === "BlogPosting") {
      if (!parsed.headline) errors.push("Article is missing 'headline'");
      if (!parsed.author) errors.push("Article is missing 'author'");
      if (!parsed.datePublished) errors.push("Article is missing 'datePublished'");
      if (parsed.headline && parsed.headline.length > 110) {
        errors.push("Headline exceeds 110 characters");
      }
    }

    if (parsed["@type"] === "FAQPage") {
      if (!parsed.mainEntity || !Array.isArray(parsed.mainEntity)) {
        errors.push("FAQPage is missing 'mainEntity' array");
      }
    }

    if (parsed["@type"] === "Product") {
      if (!parsed.name) errors.push("Product is missing 'name'");
      if (!parsed.offers) errors.push("Product is missing 'offers'");
    }

    if (parsed["@type"] === "LocalBusiness") {
      if (!parsed.name) errors.push("LocalBusiness is missing 'name'");
      if (!parsed.address) errors.push("LocalBusiness is missing 'address'");
    }

    if (parsed["@type"] === "BreadcrumbList") {
      if (!parsed.itemListElement || !Array.isArray(parsed.itemListElement)) {
        errors.push("BreadcrumbList is missing 'itemListElement' array");
      }
    }

    // Check for empty string values in required positions
    const checkEmpty = (obj: Record<string, unknown>, path: string) => {
      for (const [key, value] of Object.entries(obj)) {
        if (value === "" && !["@context", "@type"].includes(key)) {
          errors.push(`Empty value at '${path}${key}'`);
        }
        if (value && typeof value === "object" && !Array.isArray(value)) {
          checkEmpty(value as Record<string, unknown>, `${path}${key}.`);
        }
      }
    };
    checkEmpty(parsed, "");

    return {
      isValid: errors.length === 0,
      errors,
    };
  } catch (parseError) {
    return {
      isValid: false,
      errors: [`Invalid JSON: ${parseError instanceof Error ? parseError.message : "Parse error"}`],
    };
  }
}
