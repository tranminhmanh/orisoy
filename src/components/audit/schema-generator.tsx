"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Code } from "lucide-react";

interface SchemaGeneratorProps {
  onGenerate: (type: string, data: any) => void;
}

const schemaTypes = [
  "LocalBusiness",
  "Service",
  "FAQPage",
  "Article",
  "Product",
  "Organization",
  "Person",
  "Event",
  "HowTo",
  "Video",
  "BreadcrumbList",
] as const;

type SchemaType = (typeof schemaTypes)[number];

const fieldsByType: Record<SchemaType, { key: string; label: string; type?: string }[]> = {
  LocalBusiness: [
    { key: "name", label: "Business Name" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "telephone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "openingHours", label: "Opening Hours" },
  ],
  Service: [
    { key: "name", label: "Service Name" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "provider", label: "Provider" },
    { key: "areaServed", label: "Area Served" },
  ],
  FAQPage: [
    { key: "name", label: "Page Title" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "questions", label: "Questions (one per line)" },
    { key: "answers", label: "Answers (one per line)" },
  ],
  Article: [
    { key: "name", label: "Headline" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "author", label: "Author" },
    { key: "datePublished", label: "Date Published", type: "date" },
    { key: "image", label: "Image URL" },
  ],
  Product: [
    { key: "name", label: "Product Name" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "price", label: "Price" },
    { key: "currency", label: "Currency" },
    { key: "brand", label: "Brand" },
    { key: "sku", label: "SKU" },
  ],
  Organization: [
    { key: "name", label: "Organization Name" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "logo", label: "Logo URL" },
    { key: "sameAs", label: "Social Links (one per line)" },
  ],
  Person: [
    { key: "name", label: "Full Name" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "jobTitle", label: "Job Title" },
    { key: "worksFor", label: "Works For" },
  ],
  Event: [
    { key: "name", label: "Event Name" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    { key: "location", label: "Location" },
  ],
  HowTo: [
    { key: "name", label: "Title" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "totalTime", label: "Total Time (e.g. PT30M)" },
    { key: "steps", label: "Steps (one per line)" },
  ],
  Video: [
    { key: "name", label: "Video Title" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "thumbnailUrl", label: "Thumbnail URL" },
    { key: "uploadDate", label: "Upload Date", type: "date" },
    { key: "duration", label: "Duration (e.g. PT5M)" },
  ],
  BreadcrumbList: [
    { key: "name", label: "Page Title" },
    { key: "description", label: "Description" },
    { key: "url", label: "URL" },
    { key: "items", label: "Breadcrumb Items (name|url, one per line)" },
  ],
};

function buildJsonLd(type: SchemaType, data: Record<string, string>): object {
  const base: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": type,
    name: data.name || "",
    description: data.description || "",
    url: data.url || "",
  };

  switch (type) {
    case "LocalBusiness":
      if (data.telephone) base.telephone = data.telephone;
      if (data.address) base.address = data.address;
      if (data.openingHours) base.openingHours = data.openingHours;
      break;
    case "Service":
      if (data.provider) base.provider = { "@type": "Organization", name: data.provider };
      if (data.areaServed) base.areaServed = data.areaServed;
      break;
    case "Article":
      if (data.author) base.author = { "@type": "Person", name: data.author };
      if (data.datePublished) base.datePublished = data.datePublished;
      if (data.image) base.image = data.image;
      break;
    case "Product":
      if (data.price) base.offers = { "@type": "Offer", price: data.price, priceCurrency: data.currency || "USD" };
      if (data.brand) base.brand = { "@type": "Brand", name: data.brand };
      if (data.sku) base.sku = data.sku;
      break;
    case "Organization":
      if (data.logo) base.logo = data.logo;
      if (data.sameAs) base.sameAs = data.sameAs.split("\n").filter(Boolean);
      break;
    case "Person":
      if (data.jobTitle) base.jobTitle = data.jobTitle;
      if (data.worksFor) base.worksFor = { "@type": "Organization", name: data.worksFor };
      break;
    case "Event":
      if (data.startDate) base.startDate = data.startDate;
      if (data.endDate) base.endDate = data.endDate;
      if (data.location) base.location = { "@type": "Place", name: data.location };
      break;
    case "HowTo":
      if (data.totalTime) base.totalTime = data.totalTime;
      if (data.steps) {
        base.step = data.steps.split("\n").filter(Boolean).map((text, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          text,
        }));
      }
      break;
    case "Video":
      if (data.thumbnailUrl) base.thumbnailUrl = data.thumbnailUrl;
      if (data.uploadDate) base.uploadDate = data.uploadDate;
      if (data.duration) base.duration = data.duration;
      break;
    case "FAQPage":
      if (data.questions && data.answers) {
        const qs = data.questions.split("\n").filter(Boolean);
        const as_ = data.answers.split("\n").filter(Boolean);
        base.mainEntity = qs.map((q, i) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: as_[i] || "" },
        }));
      }
      break;
    case "BreadcrumbList":
      if (data.items) {
        base.itemListElement = data.items.split("\n").filter(Boolean).map((line, i) => {
          const [itemName, itemUrl] = line.split("|").map((s) => s.trim());
          return {
            "@type": "ListItem",
            position: i + 1,
            name: itemName,
            item: itemUrl || "",
          };
        });
      }
      break;
  }

  return base;
}

export function SchemaGenerator({ onGenerate }: SchemaGeneratorProps) {
  const [selectedType, setSelectedType] = useState<SchemaType>("LocalBusiness");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const fields = fieldsByType[selectedType];
  const jsonLd = buildJsonLd(selectedType, formData);
  const jsonStr = JSON.stringify(jsonLd, null, 2);

  const handleTypeChange = (type: SchemaType) => {
    setSelectedType(type);
    setFormData({});
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = async () => {
    const script = `<script type="application/ld+json">\n${jsonStr}\n</script>`;
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    onGenerate(selectedType, formData);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Code className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-zinc-700">
          Schema Generator
        </h3>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-500">
          Schema Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value as SchemaType)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {schemaTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className={cn(
              field.key === "description" ||
                field.key === "steps" ||
                field.key === "questions" ||
                field.key === "answers" ||
                field.key === "items" ||
                field.key === "sameAs"
                ? "sm:col-span-2"
                : ""
            )}
          >
            <label className="mb-1 block text-xs font-medium text-zinc-500">
              {field.label}
            </label>
            {field.key === "description" ||
            field.key === "steps" ||
            field.key === "questions" ||
            field.key === "answers" ||
            field.key === "items" ||
            field.key === "sameAs" ? (
              <textarea
                rows={3}
                value={formData[field.key] || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={field.label}
              />
            ) : (
              <input
                type={field.type || "text"}
                value={formData[field.key] || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={field.label}
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Generate Schema
      </button>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-500">
            JSON-LD Preview
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-md bg-zinc-900 p-4 text-xs text-zinc-100">
          <code>{jsonStr}</code>
        </pre>
      </div>
    </div>
  );
}
