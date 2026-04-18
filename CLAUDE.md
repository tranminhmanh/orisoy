## BẮT BUỘC ĐỌC TRƯỚC KHI CODE
Trước khi làm bất kỳ task nào chạm route/schema/form/sidebar, đọc `./INTEGRITY.md` và tuân thủ checklist. KHÔNG báo "done" nếu chưa chạy mục 9.

@AGENTS.md

# Orisoy SEO Suite - Project Knowledge Base

## Mission

AI-native SEO automation platform. 8 modules covering the full SEO lifecycle:
Research -> Content -> Audit -> Backlinks -> GEO -> Publish -> Analytics -> loop back.

Target market: Vietnamese SEO professionals. Special attention to Vietnamese NLP (word segmentation, diacritics, regional dialects).

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2.4 (App Router) | React 19, Turbopack |
| Language | TypeScript 5 | Strict mode |
| Database | PostgreSQL + Prisma 7 | Adapter-based (`@prisma/adapter-pg-worker`), generates to `src/generated/prisma` |
| Auth | NextAuth.js v4 | Credentials + Google OAuth, JWT strategy |
| AI - Text | Anthropic Claude (`@anthropic-ai/sdk`) | Content generation, analysis, scoring |
| AI - Image | OpenAI DALL-E (`openai`) | Image generation |
| SEO Data | DataForSEO API | SERP, keywords, backlinks, rankings |
| Google APIs | Search Console, Indexing API, PageSpeed Insights | Separate clients per service |
| UI | Tailwind CSS v4 + Radix UI + Recharts | No tailwind.config - uses CSS `@import "tailwindcss"` |
| Icons | lucide-react | |
| Validation | Zod v4 | |
| Dates | date-fns v4 | |
| Images | sharp | Server-side optimization |

### Critical Gotchas

- **Tailwind v4**: No `tailwind.config.ts`. Configuration via CSS `@import "tailwindcss"` in `globals.css`
- **Prisma 7**: No `url = env("DATABASE_URL")` in datasource block. URL configured via adapter in `src/lib/prisma.ts`
- **Prisma 7**: Client imports from `@/generated/prisma/client` (not `@prisma/client`)
- **Prisma 7**: Requires adapter: `new PrismaPg({ connectionString })` -> `new PrismaClient({ adapter })`
- **Next.js 16**: Breaking changes from training data. Always check `node_modules/next/dist/docs/` before writing new patterns

---

## 8 Modules

### M1: Keyword Research & Strategy
- **Purpose**: Discover, analyze, cluster keywords. Competitor intelligence.
- **Data flow**: 7 sources (autocomplete, related, PAA, questions, long-tail, competitor, AI) -> clustering -> topical map
- **Key models**: `Keyword`, `KeywordCluster`, `CompetitorDomain`
- **Intent types**: informational, navigational, commercial, transactional, local, generative
- **Pages**: `/dashboard/keywords`, `/dashboard/keywords/clusters`, `/dashboard/keywords/competitors`
- **API**: `/api/keywords/*` (6 endpoints: route, discover, cluster, suggest, competitors, intent)
- **Services**: `keyword-discovery.ts`, `keyword-clustering.ts`, `keyword-analyzer.ts`, `intent-classifier.ts`, `competitor-analyzer.ts`, `dataforseo.ts`
- **Components**: keyword-table, research-form, cluster-view, topical-map, priority-matrix, competitor-overlap, intent-badge

### M2: Content Studio & AI Writer
- **Purpose**: AI-powered content pipeline from brief to publication
- **Data flow**: Cluster -> Brief -> AI Draft -> Dual Scoring (SEO + GEO) -> Edit -> Publish
- **Key models**: `Article` (status: idea->briefed->writing->review->published->tracking), `ContentBrief`, `Image`
- **Dual scoring**: SEO score (0-100, 30 criteria) + GEO citability score (0-100, 7 dimensions)
- **Pages**: `/dashboard/content` (Kanban), `/dashboard/content/new`, `/dashboard/content/[id]`, `/dashboard/content/calendar`
- **API**: `/api/content/*` (6 endpoints: route, brief, generate, score, refresh, bulk)
- **Services**: `content-generator.ts`, `content-scorer.ts`, `claude.ts`, `seo-scorer.ts`
- **Components**: article-editor, content-brief, seo-score-panel, geo-score-panel, nlp-entity-checklist, content-kanban, generate-form

### M3: Technical SEO Audit
- **Purpose**: Crawl sites, detect issues, generate schema markup, monitor Core Web Vitals
- **Key models**: `SiteAudit`, `AuditIssue` (9 categories), `SchemaMarkup`
- **Audit categories**: crawlability, titles_meta, headings, content, images, internal_links, core_web_vitals, mobile, schema
- **Severity levels**: critical, warning, info
- **Pages**: `/dashboard/audit`, `/dashboard/audit/schema`, `/dashboard/audit/links`, `/dashboard/audit/vitals`
- **API**: `/api/audit/*` (4 endpoints: crawl, schema, links, vitals)
- **Services**: `site-crawler.ts`, `schema-generator.ts`, `internal-linker.ts`, `google-pagespeed.ts`
- **Components**: audit-summary, issue-list, schema-generator, internal-link-map, vitals-chart

### M4: Off-Page SEO (Backlinks)
- **Purpose**: Backlink analysis, toxic detection, competitor gap, AI outreach emails, brand mentions
- **Key models**: `Backlink`, `OutreachCampaign`, `BrandMention`
- **Pages**: `/dashboard/backlinks`, `/dashboard/backlinks/toxic`, `/dashboard/backlinks/gap`, `/dashboard/backlinks/outreach`, `/dashboard/backlinks/mentions`
- **API**: `/api/backlinks/*` (5 endpoints: route, toxic, gap, outreach, mentions)
- **Services**: `backlink-analyzer.ts`, `outreach-writer.ts`
- **Components**: backlink-table, toxic-score, gap-analysis, outreach-composer, mention-feed

### M5: GEO & AI Search Optimizer
- **Purpose**: Optimize content for AI search engines (ChatGPT, Perplexity, Gemini, Google AIO)
- **7 citability dimensions**: direct_answer, fact_density, source_authority, structural_clarity, entity_richness, freshness, cross_platform
- **Key models**: `GeoReport`, `AiVisibility`
- **AI platforms tracked**: chatgpt, perplexity, gemini, google_aio
- **Pages**: `/dashboard/geo`, `/dashboard/geo/simulation`, `/dashboard/geo/visibility`
- **API**: `/api/geo/*` (3 endpoints: score, simulate, visibility)
- **Services**: `citability-scorer.ts`, `simulation-engine.ts`, `visibility-tracker.ts`
- **Components**: citability-radar (7D radar chart), simulation-results, visibility-timeline

### M6: Automation & Publishing
- **Purpose**: Multi-platform publishing, scheduling, Google indexing, n8n workflow integration
- **Platforms**: wordpress, facebook, instagram, twitter
- **Key models**: `PublishJob` (status: pending->processing->published/failed), `PlatformConnection`, `IndexRequest`
- **Index methods**: indexing_api, search_console, indexnow
- **Pages**: `/dashboard/publishing`, `/dashboard/publishing/platforms`, `/dashboard/publishing/indexing`, `/dashboard/publishing/automation`
- **API**: `/api/publishing/*` (7 endpoints: route, wordpress, facebook, instagram, twitter, indexing, automation)
- **Services**: `wordpress.ts`, `facebook.ts`, `instagram.ts`, `twitter.ts`, `telegram.ts`, `scheduler.ts`, `google-indexing.ts`
- **Components**: publish-calendar, platform-card, queue-list, index-status-table, workflow-card

### M7: Analytics & Reporting
- **Purpose**: Rank tracking, ROI attribution, automated SEO reports
- **Key models**: `RankSnapshot`, `SeoReport`
- **Search engines**: google, coccoc (Vietnamese search engine)
- **Devices**: desktop, mobile
- **Report types**: weekly, monthly, quarterly
- **Pages**: `/dashboard` (unified dashboard), `/dashboard/analytics`, `/dashboard/analytics/roi`, `/dashboard/analytics/reports`
- **API**: `/api/analytics/*` (4 endpoints: route, rankings, roi, reports)
- **Services**: `rank-tracker.ts`, `google-search-console.ts`
- **Components**: stats-cards, rank-tracker-chart, seo-health-gauge, ai-visibility-card, competitor-watch, roi-summary, recent-activity

### M8: Vietnamese NLP Intelligence
- **Purpose**: Vietnamese-specific text processing for accurate keyword density, SEO scoring, rank tracking
- **Capabilities**: Word segmentation, diacritics variant generation, Bac/Trung/Nam dialect mapping
- **Services**: `word-segmenter.ts`, `diacritics.ts`, `dialect-mapper.ts`
- **Config**: Stored in `Project.settings` JSON field
- **Pages**: `/dashboard/settings/vietnamese`

---

## Project Structure

```
orisoy/
├── prisma/schema.prisma          # 21 models, 16 enums
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Tailwind v4 entry
│   │   ├── (auth)/               # Login + Register
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Dashboard shell (collapsible sidebar + header)
│   │   │   ├── page.tsx          # Unified dashboard (M7)
│   │   │   ├── keywords/         # M1 pages
│   │   │   ├── content/          # M2 pages
│   │   │   ├── audit/            # M3 pages
│   │   │   ├── backlinks/        # M4 pages
│   │   │   ├── geo/              # M5 pages
│   │   │   ├── publishing/       # M6 pages
│   │   │   ├── analytics/        # M7 pages
│   │   │   └── settings/         # Settings + M8
│   │   └── api/                  # 38 API route files
│   ├── components/
│   │   ├── ui/                   # Radix-based primitives (button, card, dialog, etc.)
│   │   ├── layout/               # sidebar.tsx, header.tsx
│   │   ├── keywords/             # 7 components
│   │   ├── content/              # 7 components
│   │   ├── audit/                # 5 components
│   │   ├── backlinks/            # 5 components
│   │   ├── geo/                  # 3 components
│   │   ├── publishing/           # 5 components
│   │   └── dashboard/            # 7 components
│   ├── lib/
│   │   ├── prisma.ts             # Singleton with PG adapter
│   │   ├── auth.ts               # NextAuth config
│   │   ├── utils.ts              # cn(), formatNumber(), slugify(), etc.
│   │   ├── ai/                   # 8 files: claude, openai, generators, scorers
│   │   ├── seo/                  # 13 files: dataforseo, crawlers, analyzers
│   │   ├── geo/                  # 3 files: citability, simulation, visibility
│   │   ├── publishing/           # 6 files: WP, social, telegram, scheduler
│   │   ├── images/               # 3 files: unsplash, pexels, optimizer
│   │   └── vietnamese/           # 3 files: segmenter, diacritics, dialect
│   ├── hooks/                    # 7 custom React hooks (one per module)
│   ├── types/index.ts            # Re-exports all Prisma types
│   └── generated/prisma/         # Prisma generated client (gitignored)
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── .env.example                  # All 24 env vars documented
```

---

## Database Schema (Key Relations)

```
User 1--* Project
Project 1--* Keyword, KeywordCluster, Article, CompetitorDomain
Project 1--* SiteAudit, SchemaMarkup, Backlink, OutreachCampaign, BrandMention
Project 1--* GeoReport, AiVisibility, PublishJob, PlatformConnection, IndexRequest
Project 1--* RankSnapshot, SeoReport, Image

KeywordCluster 1--* Keyword
KeywordCluster 1--1 Article (optional, via ClusterArticle)
Article 1--1 ContentBrief (optional)
Article 1--* Image, PublishJob, GeoReport
Article *--* Keyword (via ArticleTargetKeywords)
SiteAudit 1--* AuditIssue
Keyword 1--* RankSnapshot
User 1--* PlatformConnection
```

**Important Prisma relation names** (must match exactly when using `include`):
- Project -> competitors: `competitorDomains` (NOT `competitors`)
- Article -> brief: `brief` (NOT `contentBrief`)
- ContentBrief -> article: `article` (has `title` on Article, NOT on ContentBrief)
- PublishJob status enum: `published` (NOT `completed`)
- PublishJob date field: `publishedAt` (NOT `completedAt`)

---

## API Client Singletons

All external API clients use the global singleton pattern to avoid re-instantiation in dev:

```typescript
const globalForX = globalThis as unknown as { x: Type | undefined };
export const client = globalForX.x ?? new Client({ ... });
if (process.env.NODE_ENV !== "production") globalForX.x = client;
```

Files using this pattern: `prisma.ts`, `claude.ts`, `openai.ts`

---

## Current Status

**Build**: Clean (0 TypeScript errors)
**Lint**: Clean (0 errors, 0 warnings)
**State**: Scaffold complete. All 8 modules have:
  - Database models defined
  - API route stubs returning placeholder JSON
  - Service files with function signatures and TODO implementations
  - React components with UI layout and mock/placeholder data
  - Custom hooks for data fetching

**What's implemented (working)**:
- Dashboard layout with collapsible 8-module sidebar navigation
- Auth system (NextAuth with credentials)
- Prisma schema with all models and relations
- All UI components render with placeholder data
- Claude API client (`generateText()`) - functional
- OpenAI DALL-E client (`generateImage()`) - functional
- DataForSEO API client - functional structure
- All 38 API route stubs

**What's TODO (marked with `// TODO:` in code)**:
- Real data fetching in API routes (currently return `{ data: [] }`)
- Full AI prompt engineering for content generation, scoring, analysis
- Platform publishing integrations (WordPress REST API, Facebook Graph, etc.)
- Site crawler implementation (200+ checks)
- SERP-based keyword clustering algorithm
- Google API integrations (Search Console, Indexing, PageSpeed)
- Job queue system (BullMQ/Redis) for scheduler
- Vietnamese NLP algorithms
- Real-time dual scoring (SEO + GEO) in content editor
- Image upload and optimization pipeline

---

## Coding Conventions

1. **File naming**: kebab-case for all files (`content-generator.ts`, `keyword-table.tsx`)
2. **Components**: PascalCase exports, one component per file, `"use client"` only when needed
3. **API routes**: Export `GET`/`POST` async functions, use `NextRequest`/`NextResponse`
4. **Services**: Pure functions or class instances, throw errors with descriptive messages
5. **Error handling**: `try/catch` with `console.error` + re-throw with context
6. **Unused params**: Prefix with `_` (e.g., `_request`, `_domain`)
7. **Prisma imports**: Always from `@/generated/prisma/client`
8. **Path aliases**: `@/` maps to `src/`
9. **Enums**: Use Prisma-generated enums, don't redefine
10. **Charts**: Use Recharts (`LineChart`, `RadarChart`, `ScatterChart`, etc.)

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/orisoy

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# SEO Data
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=

# Google APIs
GOOGLE_SEARCH_CONSOLE_KEY=
GOOGLE_INDEXING_API_KEY=

# Publishing
WORDPRESS_URL=
WORDPRESS_USERNAME=
WORDPRESS_APP_PASSWORD=
FACEBOOK_ACCESS_TOKEN=
INSTAGRAM_ACCESS_TOKEN=
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=
TWITTER_BEARER_TOKEN=

# Images
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=

# Notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Automation
N8N_WEBHOOK_URL=
```

---

## Verification Checklist

Before considering any task complete:

1. `npm run build` - Zero TypeScript errors
2. `npm run lint` - Zero errors (warnings acceptable if underscore-prefixed)
3. Prisma relation names match schema exactly (check `prisma/schema.prisma`)
4. No `any` types - use `Record<string, unknown>` or specific interfaces
5. API routes with unused `request` param: prefix with `_request`
6. All new components include proper TypeScript interfaces for props
7. Charts use Recharts with `ResponsiveContainer` wrapper
8. No hardcoded API keys or secrets in code
