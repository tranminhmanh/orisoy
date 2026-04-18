# INTEGRITY CHECKS — Orisoy SEO Suite

> **Claude Code ĐỌC FILE NÀY** trước khi báo "done" cho bất kỳ task nào chạm vào:
> route mới, Prisma schema, form, sidebar, hoặc nhiều hơn 1 page.
> Nếu fail bất kỳ check nào → FIX rồi mới commit, KHÔNG được skip.

---

## 0. Khi nào chạy checklist này

| Task                                                              | Chạy check nào           |
| ----------------------------------------------------------------- | ------------------------ |
| Sửa 1 component nhỏ, không đụng route                             | Chỉ mục **9** (lint/tsc) |
| Thêm/sửa 1 page                                                   | Mục **1, 4, 9**          |
| Thêm/sửa Prisma model                                             | Mục **2, 3, 6, 7, 9**    |
| Thêm module CRUD mới (Keyword, Article, Backlink, GeoReport…)     | **TOÀN BỘ từ 1→10**      |
| Trước khi merge PR                                                | **TOÀN BỘ từ 1→10**      |

**Lưu ý Orisoy:** đây là Next.js 16 App Router với thư mục `src/`, KHÔNG phải root-level `app/`. Mọi glob phải tính thêm tiền tố `src/`.

---

## 1. Trang mồ côi (Orphan Pages)

**Định nghĩa:** page tồn tại trong `src/app/**/page.tsx` nhưng KHÔNG có `href` nào trong codebase trỏ tới.
**Hệ quả:** user không bao giờ vào được → tốn code, tốn RAM, rối menu.

### Check nhanh:
```bash
cd <đường-dẫn-tới-orisoy>

# 1. List tất cả static routes (bỏ qua dynamic [id]) — loại route group (auth), (dashboard)...
find src/app -name "page.tsx" \
  | sed 's|/page.tsx||; s|^src/app||; s|/([^)]*)||g' \
  | grep -v '\[' \
  | sort -u > /tmp/routes.txt

# 2. List tất cả href trong code
grep -rhE "href=[\"']/[a-zA-Z0-9/_-]+[\"']" src/app src/components src/lib \
  | grep -oE "/[a-zA-Z0-9/_-]+" \
  | sort -u > /tmp/hrefs.txt

# 3. Orphan = có trong routes, không có trong hrefs
echo "=== ORPHAN PAGES ==="
comm -23 /tmp/routes.txt /tmp/hrefs.txt

# 4. Broken link = href trỏ đi mà không có page
echo "=== BROKEN LINKS ==="
comm -13 /tmp/routes.txt /tmp/hrefs.txt
```

### Rule xử lý:
- **Có orphan** → hoặc thêm entry vào `src/components/layout/sidebar.tsx`/parent page, hoặc xóa page nếu không dùng.
- **Có broken link** → fix href hoặc tạo page tương ứng.
- Route group `(auth)`, `(dashboard)` không tạo URL segment — đã strip trong script.
- Dynamic route (`[id]`, `[slug]`) không bị check tự động — phải verify manually: page đó chỉ reachable qua prefix nào, prefix đó có trong sidebar/link không.

---

## 2. Data Flow Matching

Mỗi module CRUD trong Orisoy là một chuỗi:

```
Prisma Model → Zod Schema → Form → API Route → Client Hook → List/Detail Page
```

**6 mắt xích phải khớp nhau**. Lệch 1 mắt xích là bug ngầm.

### 2.1 Prisma ↔ Zod schema
- Field `required` trong Prisma → **bắt buộc** có trong Zod (không `.optional()`).
- Field `@default(...)` trong Prisma → `.optional()` trong Zod (vì client có thể không gửi).
- `enum` Prisma → `z.enum([...])` y hệt danh sách giá trị, y hệt thứ tự (Orisoy có 16 enum trong `prisma/schema.prisma`).
- `@unique` → Zod không enforce được, nhưng phải có check ở API và hiển thị lỗi UI.
- **Prisma 7 gotcha:** import client từ `@/generated/prisma/client`, KHÔNG phải `@prisma/client`.

### 2.2 Form ↔ API body
- Tất cả field form submit phải được API đọc.
- API không được nhận field "thừa" mà không dùng → strip ngầm = debug cực kỳ khó.
- Nếu form có field UI-only (ví dụ: `confirmPassword`, UI-only toggle), loại bỏ trước khi gửi.

### 2.3 API response ↔ Client type
- API trả về shape nào, client khai báo type đúng shape đó.
- **Cấm dùng `any`** cho response. Dùng `Prisma.ArticleGetPayload<{...}>` hoặc khai báo type explicit.
- Nếu API include relation, type client (trong `src/hooks/*` hoặc component) phải include y hệt.
- **Prisma relation names của Orisoy** (phải khớp chính xác khi `include`):
  - `Project.competitorDomains` (KHÔNG phải `competitors`)
  - `Article.brief` (KHÔNG phải `contentBrief`)
  - `PublishJob.publishedAt` (KHÔNG phải `completedAt`)

---

## 3. CRUD Completeness

Với mỗi Prisma model mang tính nghiệp vụ của Orisoy (Project, Keyword, KeywordCluster, Article, ContentBrief, SiteAudit, Backlink, OutreachCampaign, GeoReport, PublishJob, PlatformConnection, BrandMention…), PHẢI có đủ:

- [ ] **List page** — `src/app/dashboard/[module]/page.tsx`
- [ ] **Detail page** — `src/app/dashboard/[module]/[id]/page.tsx`
- [ ] **Create** — dialog/drawer hoặc `src/app/dashboard/[module]/new/page.tsx`
- [ ] **Edit** — dialog/drawer hoặc `src/app/dashboard/[module]/[id]/edit/page.tsx`
- [ ] **Delete action** — soft (set `deletedAt` nếu có) hoặc hard, tùy nghiệp vụ
- [ ] **API routes tương ứng trong `src/app/api/[module]/`:**
  - `GET  /api/[module]` — list với pagination, filter theo `projectId`
  - `POST /api/[module]` — create
  - `GET  /api/[module]/[id]` — read
  - `PATCH /api/[module]/[id]` — update
  - `DELETE /api/[module]/[id]` — delete
- [ ] **Custom hook** — `src/hooks/use-[module].ts` để fetch/mutate

**Thiếu bước nào → ghi rõ lý do trong comment đầu file** (ví dụ: "Article không cho phép xóa sau khi status = `published`"), đừng để Claude Code sau này nghĩ đó là bug và tự "fix".

**Context Orisoy:** tất cả resource đều scope theo `Project` — API list phải luôn filter `where: { projectId }`, lấy từ session hoặc query param.

---

## 4. Navigation Integrity

### 4.1 Sidebar
- Module mới phải có entry trong `src/components/layout/sidebar.tsx`.
- Entry gồm: icon `lucide-react` + label tiếng Việt + href đúng + (nếu cần) permission check.
- Orisoy có 8 module chính (Keywords/Content/Audit/Backlinks/GEO/Publishing/Analytics/Settings) — giữ đúng order.

### 4.2 Breadcrumb
- Detail page → breadcrumb về list.
- Edit page → breadcrumb về detail → list.
- Format nhất quán: `Trang chủ / Content / Bài viết XYZ / Chỉnh sửa`.

### 4.3 Back button
- Nếu page không có breadcrumb → phải có `← Quay lại` ở góc trên.
- Modal/Drawer → luôn có nút `Hủy` và close (X).

### 4.4 After-action redirect (NHẤT QUÁN TOÀN APP)
| Action             | Redirect tới                                     |
| ------------------ | ------------------------------------------------ |
| Create thành công  | `/dashboard/[module]/[id]` (detail record vừa tạo) |
| Update thành công  | **Ở lại page**, toast "Đã cập nhật"              |
| Delete thành công  | `/dashboard/[module]` (list)                     |
| Lỗi validation     | Ở lại form, scroll tới field lỗi đầu tiên        |
| Lỗi server         | Ở lại form, toast đỏ                             |

**KHÔNG tự ý đổi quy tắc này cho từng module** — đổi 1 cái là user confuse toàn app.

---

## 5. State & Cache Consistency

- Sau mutation thành công ở page X, các page Y có dữ liệu liên quan phải refetch.
- Orisoy dùng custom hook pattern trong `src/hooks/` — sau mutation gọi `mutate()` (nếu SWR) hoặc `queryClient.invalidateQueries()` (nếu React Query).
- **Server Component**: gọi `router.refresh()` trong client component sau mutation, hoặc `revalidatePath('/dashboard/content')` trong server action.
- Quan hệ chéo module cần invalidate:
  - Tạo/xóa `Article` → invalidate `keywords` (vì `KeywordCluster` có optional relation tới Article).
  - Publish xong (`PublishJob.status = published`) → invalidate dashboard stats + analytics.
  - Chạy `SiteAudit` mới → invalidate dashboard SEO health gauge.
- Đừng dựa vào `window.location.reload()` — mất state client.

---

## 6. Enum & Status Matching

Orisoy có 16 enum trong Prisma (ArticleStatus, PublishJobStatus, AuditSeverity, IntentType, AiPlatform…). Mỗi enum phải **giống y hệt ở 3 chỗ**:

1. **`prisma/schema.prisma`** — enum gốc. Ví dụ:
   ```prisma
   enum ArticleStatus {
     idea
     briefed
     writing
     review
     published
     tracking
   }
   ```
2. **`src/lib/enums.ts`** (tạo nếu chưa có) — object map label VN + màu badge:
   ```ts
   import type { ArticleStatus } from "@/generated/prisma/client";

   export const ARTICLE_STATUS_LABEL: Record<ArticleStatus, string> = {
     idea: "Ý tưởng",
     briefed: "Đã brief",
     writing: "Đang viết",
     review: "Đang review",
     published: "Đã xuất bản",
     tracking: "Đang theo dõi",
   };
   export const ARTICLE_STATUS_COLOR: Record<ArticleStatus, string> = { ... };
   ```
3. **UI component** (kanban, badge, filter…) — import từ `src/lib/enums.ts`, **KHÔNG hardcode string**.

**Sai lầm thường gặp:** sửa enum trong Prisma mà quên sửa `src/lib/enums.ts` → UI hiển thị `undefined`, badge không có màu.

**Cảnh báo từ CLAUDE.md:** `PublishJob.status` dùng giá trị `published`, KHÔNG phải `completed`. Đã có lỗi này trong quá khứ.

---

## 7. Foreign Key & Relation Integrity

- Mỗi relation Prisma: xác định rõ `onDelete`:
  - `Cascade` — xóa cha, xóa con (ví dụ: `Project → Keyword`, `SiteAudit → AuditIssue`, `Article → Image`).
  - `Restrict` — không cho xóa cha nếu có con (ví dụ: `Project → Article` nếu đang có bài published).
  - `SetNull` — xóa cha, con giữ lại nhưng FK = null (ví dụ: `KeywordCluster → Article` có thể null-able).
- **Trong UI**: khi user click delete, nếu record đang được reference → disable nút và hiện tooltip giải thích.
- **Đừng dựa vào Prisma throw error** để báo UI — check trước khi gọi.
- **Cẩn thận với many-to-many**: `Article ↔ Keyword` qua bảng `ArticleTargetKeywords` — khi xóa Article phải xóa bản ghi trung gian trước hoặc set cascade.

---

## 8. Permission & Auth

Orisoy dùng NextAuth v4 (JWT strategy, Credentials + Google OAuth).

- **Route dashboard** → check ở `src/app/dashboard/layout.tsx`:
  ```ts
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";
  import { redirect } from "next/navigation";

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  ```
- **API** → check ở đầu handler, trả `401` nếu không có session, `403` nếu thiếu quyền. **KHÔNG tin session từ client.**
- **Scope theo Project**: mọi API list/mutation phải verify `projectId` thuộc về user hiện tại. Bỏ qua = user A có thể đọc data user B.
- **Sidebar** → ẩn entry nếu không đủ quyền (đừng chỉ disable, để tránh lộ cấu trúc).

Check cả **2 tầng** (layout + API) — chỉ 1 tầng là có lỗ.

---

## 9. Pre-commit commands (COPY-PASTE)

```bash
cd <đường-dẫn-tới-orisoy>

# 1. Lint + typecheck
npm run lint
npx tsc --noEmit

# 2. Prisma
npx prisma validate
npx prisma format
# Đảm bảo Prisma client được generate (Orisoy generate tới src/generated/prisma/)
npx prisma generate

# 3. Orphan + broken link check (chú ý: src/app, không phải app)
find src/app -name "page.tsx" \
  | sed 's|/page.tsx||; s|^src/app||; s|/([^)]*)||g' \
  | grep -v '\[' | sort -u > /tmp/routes.txt
grep -rhE "href=[\"']/[a-zA-Z0-9/_-]+[\"']" src/app src/components src/lib 2>/dev/null \
  | grep -oE "/[a-zA-Z0-9/_-]+" | sort -u > /tmp/hrefs.txt
echo "=== ORPHAN ==="; comm -23 /tmp/routes.txt /tmp/hrefs.txt
echo "=== BROKEN ==="; comm -13 /tmp/routes.txt /tmp/hrefs.txt

# 4. Build thử (bắt lỗi mà tsc không bắt được — Turbopack + Next 16)
npm run build
```

**Nếu bất kỳ lệnh nào fail → FIX rồi mới commit.**

**Ngưỡng chấp nhận:**
- `npm run build` → **0 TypeScript error**, **0 ESLint error** (warnings chấp nhận được nếu prefix `_`).
- `npx prisma validate` → OK.
- Orphan/broken list → trống, hoặc có kèm lý do giải thích trong PR.

---

## 10. PR Description Template

Khi tạo PR, Claude Code bắt buộc điền:

```markdown
### Module ảnh hưởng
- [M1 Keywords / M2 Content / M3 Audit / M4 Backlinks / M5 GEO / M6 Publishing / M7 Analytics / M8 Vietnamese NLP / Settings / Auth]

### Thay đổi
- [ ] Thêm trang: ...
- [ ] Sửa trang: ...
- [ ] Thay đổi Prisma schema: có / không — nếu có, mô tả:
- [ ] Migration cần chạy: `npx prisma db push` hay `prisma migrate dev --name ...`
- [ ] Env var mới cần thêm vào `.env.example`: có / không

### Checklist
- [ ] Orphan check: PASS / có N trang (kèm lý do từng trang)
- [ ] Broken link check: PASS / FAIL
- [ ] CRUD completeness: đủ / thiếu bước ... (lý do)
- [ ] Enum matching (Prisma ↔ `src/lib/enums.ts` ↔ UI): PASS
- [ ] Sidebar entry trong `src/components/layout/sidebar.tsx`: đã thêm / không cần
- [ ] Breadcrumb + back button: đã có / không cần
- [ ] After-action redirect: đúng quy tắc mục 4.4
- [ ] Permission check 2 tầng (dashboard layout + API handler): đủ / không cần
- [ ] Project scope filter trong API (`where: { projectId }`): đủ
- [ ] `npm run build`: PASS (0 error, 0 warning)
- [ ] `npx tsc --noEmit`: PASS
- [ ] `npx prisma validate`: PASS

### Manual test steps
1. ...
2. ...

### Known limitation / TODO sau
- ...
```

---

## 11. Khi Claude Code KHÔNG chắc

**KHÔNG đoán.** Dừng lại, hỏi user (Mạnh):
- "Module `Article` có cho phép xóa sau khi `status = published` không?"
- "Sidebar có nên ẩn entry `GEO` với role `viewer` không?"
- "Enum `AiPlatform` đã final 4 giá trị (chatgpt/perplexity/gemini/google_aio) chưa hay còn thêm?"
- "Khi scoring Article bằng Claude, dùng model `claude-opus-4-7` hay `claude-sonnet-4-6`?"
- "DataForSEO task nào cần chạy async (qua queue) vs sync?"

**Sai lầm tệ nhất:** tự quyết rồi code → user phát hiện sau 2 tuần, phải refactor ngược.

**Đặc biệt với Orisoy:** trước khi viết code dùng Next.js 16 pattern mới, đọc `node_modules/next/dist/docs/` như `AGENTS.md` đã dặn — API có breaking change so với training data.
