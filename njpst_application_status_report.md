# NJPST — Application Status Report
**Nigerian Journal of Polymer Science and Technology · Polymer Institute of Nigeria (PIN)**
*Full-Stack Filesystem Audit | Generated: 07 July 2026*

---

## Table of Contents

1. Executive Summary
2. Global & Environment Status
3. Page-by-Page Technical Audit
4. Component Audit
5. API Route Audit
6. Database & Record State
7. Middleware & Security Layer
8. Design System Compliance Report
9. Phase 4 Implementation Matrix
10. Critical Defects & Open Issues Register

---

## 1. Executive Summary

### Framework Stack

| Layer | Technology | Version | Status |
|---|---|---|---|
| Framework | Next.js | ^14.2.35 | Active |
| Language | TypeScript | ^5.6.3 | Active |
| Styling | Tailwind CSS | ^4.3.0 | WARN: Misconfigured (see section 2) |
| ORM | Prisma Client | ^7.8.0 | Active |
| DB Adapter | @prisma/adapter-pg | ^7.8.0 | Active |
| Database | PostgreSQL (Supabase) | - | Connected |
| Auth | NextAuth.js | ^4.24.14 | WARN: Partially Wired |
| Password Hashing | bcryptjs | ^3.0.3 | Active |
| DB Connection Pool | pg | ^8.21.0 | Active |
| Build Tooling | PostCSS + Autoprefixer | - | Active |

### Deployment Readiness

| Area | Score | Notes |
|---|---|---|
| Public-facing pages | 8/10 | Homepage, Archive, Article detail are production-ready |
| Auth system | 5/10 | NextAuth wired but NEXTAUTH_SECRET + Google OAuth keys absent |
| Editorial workflows | 7/10 | Editor & Reviewer dashboards fully functional; access control is cookie-naive |
| Payment / APC | 2/10 | Token validation implemented; Paystack gateway not yet integrated |
| SEO / Indexing | 9/10 | HighWire Press + Dublin Core meta tags present on article pages |
| Design System | 7/10 | Monochromatic Royal Blue applied to most pages; archive page lacks dark: tokens |

### Overall Verdict

The platform has completed a solid Phase 3 build. All core editorial workflows (submission -> review assignment -> decision) function end-to-end via the API layer. The primary blocker for production launch is the missing auth environment variables and the absence of a Paystack payment checkpoint before article submission reaches the database.

---

## 2. Global & Environment Status

### 2.1 src/app/globals.css

Current State: 2 lines. Contains only the Tailwind v4 import directive.

Issues:
- File contains only @import "tailwindcss" — no custom CSS tokens, no font stack imports, no CSS custom properties defined.
- MISSING: No Google Fonts import (Inter, Outfit, or similar). All pages render with browser default sans-serif.
- MISSING: No dark mode configuration. The tailwind.config.ts does not set darkMode: 'class', meaning all dark: utility classes present across every page are INERT and will never activate.

What must be implemented:

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import "tailwindcss";
  :root { --font-sans: 'Inter', system-ui, -apple-system, sans-serif; }
  body { font-family: var(--font-sans); }

---

### 2.2 src/app/layout.tsx

Current State: 21 lines. Bare-minimum layout with no font class, no SessionProvider, no dark mode toggle.

Issues:
- [OK] Title and description metadata are correct and meaningful.
- [FAIL] No font class applied to html or body. All page-level typography uses browser defaults.
- [FAIL] No SessionProvider wrapper from next-auth/react. Client components using useSession() will silently fail.
- [FAIL] No suppressHydrationWarning on html — required when adding dark-mode class toggling.
- [FAIL] No ThemeProvider or dark mode toggle logic despite dark: classes used extensively across every page.

What must be implemented:
  - Import SessionProvider from next-auth/react, wrap children.
  - Import Inter from next/font/google, apply variable class to html.
  - Add suppressHydrationWarning to html element.

---

### 2.3 tailwind.config.ts

Current State: Bare config with content paths, empty theme.extend, no plugins.

Issues:
- [FAIL] darkMode key is absent. Since the project uses Tailwind v4 via @import "tailwindcss", the tailwind.config.ts file may be entirely ignored in v4's CSS-first config paradigm. ALL dark: utility pairs across every page are LIKELY NON-FUNCTIONAL.
- [WARN] No custom blue scale extension. No brand tokens are codified.

Resolution: Either add @variant dark selector to globals.css (Tailwind v4 approach), or add darkMode: 'class' to tailwind.config.ts if it is still being read.

---

### 2.4 prisma.config.ts

Current State: Imports dotenv, calls dotenv.config(), then defineConfig with seed command and DATABASE_URL.

Assessment:
- [OK] dotenv.config() is called before process.env.DATABASE_URL is read — correct loading order.
- [OK] Seed command correctly points to prisma/seed.ts via tsx.
- [OK] DATABASE_URL is defined in .env pointing to Supabase PostgreSQL (EU-West-1).
- [WARN] datasource db {} block in schema.prisma does NOT include a url field — relies entirely on prisma.config.ts. Valid in Prisma 7 but may confuse teams unfamiliar with v7.

---

### 2.5 Environment Variables (.env)

| Variable | Present | Notes |
|---|---|---|
| DATABASE_URL | YES | Supabase pooler (transaction mode, port 5432) |
| DIRECT_URL | YES | Supabase pooler (session mode) |
| NEXTAUTH_SECRET | MISSING | BLOCKING — NextAuth will throw in production |
| NEXTAUTH_URL | MISSING | Required for OAuth callback URL construction |
| GOOGLE_CLIENT_ID | MISSING | Google OAuth provider will silently fail |
| GOOGLE_CLIENT_SECRET | MISSING | Google OAuth provider will silently fail |
| PAYSTACK_SECRET_KEY | MISSING | Phase 4 dependency |
| PAYSTACK_PUBLIC_KEY | MISSING | Phase 4 dependency (client-side popup) |

Action required: Generate NEXTAUTH_SECRET via openssl rand -base64 32 and add all missing variables to .env.

---

## 3. Page-by-Page Technical Audit

### 3.1 Homepage — src/app/page.tsx

Route: /  |  Type: Async Server Component  |  Size: 466 lines / 22,963 bytes

What it currently contains:
- Full sticky navigation header with brand block (NJPST / PIN) and desktop nav links.
- Mobile hamburger menu button — NO onClick handler or open/close state (dead button on mobile).
- Minimalist hero section with headline and GET search form submitting to /archive?q=.
- Trust banner: Gold Open Access, Double-Blind Peer Reviewed, Crossref DOI Enabled.
- Featured Volume split-card (geometric cover placeholder + article list). Fallbacks to Vol. 15, Issue 2.
- Published Articles feed with title, author, date, keyword pills, abstract, PDF download link.
- Empty-state panels for featured volume and articles feed.
- 4-column footer: About NJPST, Editorial Board, For Authors, Indexing & Compliance.

Data queries:
1. prisma.article.findMany — all PUBLISHED articles, ordered by createdAt desc.
2. prisma.issue.findFirst — latest PUBLISHED issue with up to 3 published articles.

Issues:
- [FAIL] Mobile navigation is non-functional (hamburger button has no handler).
- [WARN] Submit Manuscript nav link points to /dashboard/author/submit — route does NOT exist (actual: /submit).
- [WARN] Footer Submit Manuscript link also points to /dashboard/author/submit — same broken link.

What must be implemented next:
- Mobile navigation menu (state-toggled nav panel, or separate MobileNav client component).
- Fix two broken nav links: /dashboard/author/submit -> /submit.

---

### 3.2 Login Page — src/app/login/page.tsx

Route: /login  |  Type: use client  |  Size: 265 lines / 10,353 bytes

What it currently contains:
- Single useState(true) toggle: isLogin controls Sign-In vs Registration mode.
- Registration mode fields: Full Name, Academic Affiliation/Institution, Email, Password.
- Sign-in mode fields: Email, Password only.
- handleSubmit branches on isLogin:
  Registration: POST /api/auth/register, then signIn credentials, redirect to /submit.
  Sign-in: signIn credentials, redirect to /submit.
- Google OAuth button: signIn('google', { callbackUrl: '/submit' }).
- Error banner, loading state, footer toggle.

Design system: Light-mode PASS. Dark-mode: FAIL (no dark: token pairs on login page).

Issues:
- [FAIL] window.location.href = '/submit' hard redirect — ignores user role for routing.
- [FAIL] No role-based post-login redirect. All users land at /submit regardless of role.
- [FAIL] No SessionProvider wrapping the layout.
- [WARN] Google OAuth button has no loading/disabled state.
- [WARN] No Forgot Password link rendered.

What must be implemented next:
- Role-based redirect: read session.user.role after signIn() resolves.
- Add SessionProvider to layout.tsx.
- Add Forgot Password placeholder.

---

### 3.3 Article Detail Page — src/app/article/[id]/page.tsx

Route: /article/[id]  |  Type: Async Server Component  |  Size: 176 lines / 6,835 bytes

What it currently contains:
- generateMetadata: async params, DB fetch, graceful fallback title, HighWire Press tags (citation_title, citation_author, citation_publication_date, citation_pdf_url), Dublin Core tags (DC.Title, DC.Creator, DC.Date, DC.Publisher), openGraph.type = 'article'.
- Page component: fetches article with author and issue, calls notFound() if null.
- Renders: back nav, h1 title, DOI badge (conditional), contributor card, abstract section, keyword pill tray, PDF download CTA.

Design system: FULLY COMPLIANT — full dark: token pairs on all elements.

Issues:
- [OK] No critical issues. Most complete and well-structured page in the project.
- [WARN] citation_pdf_url uses raw pdfUrl from DB (mock URL in seed data). Production needs real cloud storage URL.
- [WARN] No canonical URL link tag for indexing hygiene.
- [FAIL] No access control — any article (SUBMITTED, UNDER_REVIEW, REJECTED) is publicly readable if UUID is known.

What must be implemented next:
- Add: if (article.status !== 'PUBLISHED') notFound()
- Add canonical URL to metadata.

---

### 3.4 Editor Dashboard — src/app/editor/page.tsx

Route: /editor  |  Type: Async Server Component  |  Size: 272 lines / 12,689 bytes

What it currently contains:
- Accepts searchParams: Promise<{ search?, status? }>.
- Builds dynamic Prisma where clause: validates status enum, case-insensitive search on title and author.name.
- Fetches all articles with author, reviewAssignments (with reviewer.name).
- Fetches all REVIEWER users for assignment dropdown.
- Header: "Editor Control Room". Filter bar: DashboardFilters client component.
- Empty state: dashed border card with InboxIcon.
- Data table: 7 columns (Title, Author, Affiliation, Status badge, Submitted date, Reviewer Feedback, Actions).
- Status badges: 4-value Record<ArticleStatus, string> with full dark: token pairs.
- Actions: AssignReviewerAction dropdown or reviewer name chip; EditorialDecisionAction if UNDER_REVIEW.
- Summary footer with article count, filter state, reviewer count.

Grid/Layout: Table uses overflow-x-auto wrapper. whitespace-nowrap on th cells. DashboardFilters uses flex flex-wrap gap-4 with min-w-[220px].

Design system: FULLY COMPLIANT — all dark: token pairs present.

Issues:
- [FAIL] No authentication guard. Middleware only checks a user-role cookie (trivially spoofable).
- [WARN] formatDate uses en-NG locale with hour/minute — could produce long strings in narrow table cells.

What must be implemented next:
- Replace cookie-based middleware with getServerSession(authOptions) check.
- Add pagination (currently shows all articles with no limit).

---

### 3.5 Reviewer Dashboard — src/app/reviewer/page.tsx

Route: /reviewer  |  Type: Async Server Component  |  Size: 193 lines / 8,786 bytes

What it currently contains:
- Accepts searchParams: Promise<{ id?: string }> — reviewer UUID via URL query param.
- Guard state (no ID): styled warning card with usage instructions.
- Loaded state (ID present): fetches reviewAssignment.findMany for reviewerId, with article title and abstract.
- Results sorted by status: 'asc' (alphabetical: ACCEPTED, COMPLETED, DECLINED, PENDING).
- Assignment cards: status badge, h2 title, abstract.
- COMPLETED assignments: shows recommendation and authorFeedback.
- PENDING assignments: renders SubmitReviewForm client component.
- Summary footer: N assignments · N pending.

Design system: FULLY COMPLIANT — full dark: token pairs on all elements.

Issues:
- [FAIL] Reviewer ID passed as plain URL query param — any user knowing a UUID can view assignments.
- [FAIL] No authentication guard.
- [WARN] Alphabetical sort puts ACCEPTED before PENDING — PENDING items should appear first.

What must be implemented next:
- Derive reviewerId from getServerSession(authOptions) instead of URL query param.
- Remove ?id= mechanism from production.

---

### 3.6 Manuscript Submission Page — src/app/submit/page.tsx

Route: /submit  |  Type: use client  |  Size: 201 lines / 10,688 bytes

What it currently contains:
- 6 state variables: title, abstract, keywords, pdfUrl, authorId, apcTokenCode.
- handleSubmit: splits keywords by comma, builds payload, conditionally includes apcTokenCode, POSTs to /api/articles.
- Success/error banners. Form fields: Title*, Abstract*, Keywords*, PDF URL*, Author ID*, APC Waiver Token (optional).
- Header: "Author Workspace" with FileIcon.
- Shared inputClass string for consistent field styling.

Design system: FULLY COMPLIANT — full dark: token pairs on all elements.

Issues:
- [FAIL] authorId is a manual text field. Must be replaced with session.user.id from useSession().
- [FAIL] No authentication check. Unauthenticated visitors can access and submit.
- [FAIL] No file upload. pdfUrl accepts a raw URL string — no actual PDF upload integration.
- [FAIL] No APC payment gate. Users without waiver token can submit without paying.

What must be implemented next:
1. Protect route with session check — redirect to /login if unauthenticated.
2. Replace authorId field with session.user.id.
3. Integrate file upload (Supabase Storage, store public URL in pdfUrl).
4. Implement APC payment gate — redirect to /checkout/[articleId] (Paystack) if no valid apcTokenCode.

---

### 3.7 Archive / Search Page — src/app/archive/page.tsx

Route: /archive  |  Type: Async Server Component  |  Size: 353 lines / 14,344 bytes

What it currently contains:
- Accepts searchParams: Promise<{ q?, volume?, keyword? }>.
- Builds composite where clause: PUBLISHED always present, optional full-text OR across title/abstract/keywords, optional keyword tag, optional volume filter (integer regex-validated).
- Parallel Promise.all: articles + published volumes + all keywords.
- Keyword frequency map — top 20 keywords for facet cloud.
- Sidebar: Search input (defaultValue), Volume filter (button list), Keyword pills, Clear filters button.
- Results: article cards with title, author, date, volume, keywords, abstract, PDF download link.
- Empty state and search feedback header.

Design system: NON-COMPLIANT — root div uses bg-white with no dark: counterpart.

Issues:
- [FAIL] Sidebar Volume filter buttons have type="button" and NO onClick handler — clicking does nothing.
- [FAIL] Keyword pill buttons have no onClick handler — non-functional.
- [FAIL] Clear all filters button has no handler — non-functional.
- [FAIL] Search input uses defaultValue but has no form wrapper or onChange to update URL — sidebar search does not work.
- [FAIL] No dark: token pairs — does not follow Phase 3 design system.
- [WARN] No navigation header.

What must be implemented next:
- Convert sidebar buttons to router.push() calls that update URL params.
- Add use client filter sidebar component (similar to DashboardFilters).
- Add dark: token pairs throughout.
- Add navigation header consistent with other pages.

---

### 3.8 Checkout Page — src/app/checkout/[articleId]/page.tsx

Route: /checkout/[articleId]  |  Current state: FILE IS EMPTY (0 bytes)

What must be implemented: Full Paystack payment integration (see Phase 4 Matrix, section 9).

---

### 3.9 Dashboard Routes — src/app/dashboard/

All subdirectories exist (dashboard/author, dashboard/editor, dashboard/reviewer) but contain NO page.tsx files.
dashboard/layout.tsx is also 0 bytes.
Homepage navigates to /dashboard/author/submit which returns 404.

What must be implemented next:
- Either implement the nested dashboard routes with proper layouts, or remove the dashboard/ directory and correct all nav links to point to flat routes (/submit, /editor, /reviewer).

---

## 4. Component Audit

### 4.1 DashboardFilters.tsx — PASS
Uses useRouter, usePathname, useSearchParams for URL-synchronized filter state. updateParam callback correctly uses URLSearchParams. flex flex-wrap gap-4 with min-w-[220px]. Status dropdown maps Object.values(ArticleStatus). Full dark: token pairs.

### 4.2 AssignReviewerAction.tsx — PASS
POSTs { articleId, reviewerId } to /api/reviews. Calls router.refresh() on success. Success/error inline alerts. Disabled state on button when no reviewer selected.

### 4.3 EditorialDecisionAction.tsx — PASS (pattern-inferred from 4,326 bytes)
POSTs to /api/articles/decision.

### 4.4 SubmitReviewForm.tsx — PASS
POSTs { assignmentId, comments, recommendation } to /api/reviews/submit. 5-row resizable textarea. RecommendationScore enum from @prisma/client. router.refresh() on success. disabled propagated to inputs and button.

### 4.5 Icons.tsx — PASS
Contains: BookIcon, GoogleIcon, GlobeIcon, ScalesIcon, IdBadgeIcon, FileIcon, CheckIcon, CrossIcon, InboxIcon, SearchIcon, UserIcon, WarningIcon, ClipboardIcon, ChevronLeftIcon, PencilIcon. All accept className prop.

### 4.6 Navigation.tsx and Sidebar.tsx — FAIL
Both files are 0 bytes — empty placeholders. Intended global nav and sidebar components not implemented.

---

## 5. API Route Audit

### 5.1 POST /api/articles

| Check | Status |
|---|---|
| JSON parse error handling | PASS — SyntaxError caught |
| Field presence validation | PASS — All 5 required fields validated |
| UUID format validation | PASS — isValidUuid() called on authorId |
| Author existence check | PASS — findUnique on authorId |
| APC token validation | PASS — Checks isRedeemed before transaction |
| Atomic transaction | PASS — prisma. for article + token redemption |
| Response codes | PASS — 400 / 500 / 201 |
| Authentication guard | FAIL — None, unauthenticated requests accepted |

### 5.2 POST /api/auth/register

| Check | Status |
|---|---|
| Email validation | PASS |
| Password length check | PASS — Minimum 6 characters |
| Full name validation | PASS |
| Duplicate email check | PASS — findUnique before creation |
| Password hashing | PASS — bcrypt.hash(password, 10) |
| passwordHash excluded from response | PASS — Manually omitted |
| Role assignment | PASS — Defaults to Role.AUTHOR |
| Response codes | PASS — 400 / 500 / 201 |

### 5.3 GET+POST /api/auth/[...nextauth]

| Check | Status |
|---|---|
| Google OAuth provider | PASS (configured; keys missing in .env) |
| Credentials provider | PASS — bcrypt.compare against passwordHash |
| JWT strategy | PASS — session.strategy = 'jwt' |
| Custom JWT claims | PASS — id, role, affiliation injected |
| Custom session claims | PASS — Passed through from JWT |
| Custom sign-in page | PASS — pages.signIn = '/login' |
| NEXTAUTH_SECRET | FAIL — Missing from .env |

### 5.4 POST /api/reviews — Assign Reviewer

| Check | Status |
|---|---|
| UUID validation on articleId | PASS |
| UUID validation on reviewerId | PASS |
| REVIEWER role check | PASS |
| Duplicate assignment guard | PASS — findFirst check |
| Authentication guard | FAIL — None |
| Response codes | PASS — 400 / 500 / 201 |

### 5.5 POST /api/reviews/submit — Submit Review

| Check | Status |
|---|---|
| assignmentId UUID validation | PASS |
| recommendation enum validation | PASS |
| Assignment existence check | PASS |
| Already-completed guard | FAIL — Can re-submit a COMPLETED review |
| Authentication guard | FAIL — None |
| Response codes | PASS — 400 / 404 / 500 / 200 |

### 5.6 POST /api/articles/decision — Editorial Decision

| Check | Status |
|---|---|
| articleId UUID validation | PASS |
| status enum validation | PASS |
| Article existence check | PASS |
| EDITOR role guard | FAIL — None |
| Authentication guard | FAIL — None |
| Response codes | PASS — 400 / 404 / 500 / 200 |

---

## 6. Database & Record State

### 6.1 Schema Summary — prisma/schema.prisma

Enums defined:

| Enum | Values |
|---|---|
| Role | READER, AUTHOR, REVIEWER, EDITOR |
| ArticleStatus | SUBMITTED, UNDER_REVIEW, REJECTED, PUBLISHED |
| ReviewStatus | PENDING, ACCEPTED, COMPLETED, DECLINED |
| RecommendationScore | ACCEPT, MINOR_REVISIONS, REJECT |
| IssueStatus | DRAFT, PUBLISHED |

Models:

| Model | Key Fields | Relations | Indexes |
|---|---|---|---|
| User | id (UUID), email (unique), name, role, affiliation?, passwordHash? | articles, reviewAssignments | None explicit |
| Article | id (UUID), title, abstract (Text), keywords (String[]), pdfUrl, status, doi? (unique), authorId, issueId? | author, issue?, reviewAssignments | @@index([status]), @@index([authorId]) |
| ReviewAssignment | id (UUID), articleId, reviewerId, status, editorFeedback?, authorFeedback?, recommendation? | article, reviewer | @@index([articleId, reviewerId]) |
| Issue | id (UUID), volume (Int), issueNumber (Int), status, publishedAt? | articles | None |
| ApcToken | id (UUID), tokenCode (unique), isRedeemed, createdAt | None | None |

Schema gap analysis:
- [WARN] datasource db {} block is missing the url field — relies entirely on prisma.config.ts. Valid in Prisma 7 but breaks older Prisma CLI tooling.
- [WARN] ReviewAssignment.editorFeedback field exists in schema but is NEVER written to in any current API endpoint. The submit review endpoint writes to authorFeedback only. editorFeedback is currently orphaned.
- [WARN] No updatedAt field on ReviewAssignment — audit trail is incomplete.
- [WARN] No DB-level UNIQUE constraint on ReviewAssignment(articleId, reviewerId) — duplicate check is application-code only, not enforced at DB level.

---

### 6.2 Seed Data — prisma/seed.ts

Seeding order (FK-safe deletion cleanup):
ApcToken cleanup -> ReviewAssignment cleanup -> Article cleanup -> User cleanup -> Issue cleanup

System Users created:

| Name | Email | Role | Affiliation | passwordHash |
|---|---|---|---|---|
| Prof. S. M. Gumel | editor@njpst.org | EDITOR | Bayero University Kano | NONE |
| Dr. Fatima Umar | author.test@university.edu | AUTHOR | Ahmadu Bello University | NONE |
| Prof. John Doe | reviewer1@academic.net | REVIEWER | University of Ibadan | NONE |

WARNING: All seeded users have NO passwordHash — they cannot sign in via credentials. The authorize function checks !user.passwordHash and rejects these accounts immediately.

Journal Issues created:

| Volume | Issue Number | Status |
|---|---|---|
| 1 | 1 | DRAFT |

APC Waiver Tokens created:

| Token Code | Status |
|---|---|
| NJPST-WAIVER-2026-XYZ | isRedeemed: false |
| PIN-POLYMER-FREE-99 | isRedeemed: false |
| BUK-CHEMISTRY-DEPT | isRedeemed: false |

Sample Manuscript created:

| Field | Value |
|---|---|
| Title | Synthesis and Characterization of Novel Polymer Nanocomposites for Water Purification |
| Status | UNDER_REVIEW |
| Author | Dr. Fatima Umar |
| PDF URL | https://example.com/mock-manuscript-upload.pdf (placeholder) |
| Issue | Not assigned |
| Keywords | Polymer Science, Nanocomposites, Water Treatment, Green Chemistry |

Seed script issues:
- [OK] Deletion order respects foreign key constraints.
- [FAIL] Seeded users have no password — cannot test credentials login. Add passwordHash: await bcrypt.hash('test-password-123', 10) to each seed user.
- [WARN] Comment in seed.ts says "reverse order of relationships" but the order shown is correct forward-deletion — comment is misleading.

---

## 7. Middleware & Security Layer

### 7.1 src/middleware.ts

Route matcher: /editor/:path*, /reviewer/:path*

Current implementation reads user-role cookie and redirects to / if it does not match EDITOR or REVIEWER.

Security assessment:

| Issue | Severity |
|---|---|
| Cookie-based auth — trivially spoofable by setting any cookie value | CRITICAL |
| No JWT/session verification whatsoever | CRITICAL |
| /submit and /api/* routes not protected | HIGH |
| No rate limiting on /api/auth/register | HIGH |
| No CSRF protection on mutating API routes | HIGH |

What must be implemented — replace with getToken() from next-auth/jwt:

  import { getToken } from 'next-auth/jwt';

  export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (pathname.startsWith('/editor') && token?.role !== 'EDITOR') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/reviewer') && token?.role !== 'REVIEWER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/submit') && !token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

---

## 8. Design System Compliance Report

System Specification: Phase 3 Monochromatic Royal Blue

| Token Level | Tailwind Class | Usage |
|---|---|---|
| Deep canvas | bg-blue-950 | All internal page backgrounds |
| Mid canvas | bg-blue-900 | Dark header backgrounds |
| Surface | bg-blue-50 | Page backgrounds (light mode) |
| Border | border-blue-100 / border-blue-800 | Light/dark borders |
| Primary action | bg-blue-600 hover:bg-blue-700 | All CTA buttons |
| Dark primary action | dark:bg-blue-400 dark:hover:bg-blue-300 | Dark mode CTAs |
| Text strong | text-blue-950 dark:text-blue-100 | Headings |
| Text body | text-blue-800 dark:text-blue-200 | Body copy |
| Text muted | text-blue-500 dark:text-blue-400 | Metadata, labels |
| Text accent | text-blue-600 dark:text-blue-400 | Links, icon accents |

Compliance by page:

| Page | Light Mode | Dark Mode | Overall |
|---|---|---|---|
| Homepage (/) | PASS | PASS — Full pairs present | COMPLIANT |
| Login (/login) | PASS | FAIL — No dark: pairs | PARTIAL |
| Article (/article/[id]) | PASS | PASS — Full pairs | COMPLIANT |
| Editor (/editor) | PASS | PASS — Full pairs | COMPLIANT |
| Reviewer (/reviewer) | PASS | PASS — Full pairs | COMPLIANT |
| Submit (/submit) | PASS | PASS — Full pairs | COMPLIANT |
| Archive (/archive) | PARTIAL (light only) | FAIL — No dark: at root | NON-COMPLIANT |
| Checkout (/checkout) | NOT IMPLEMENTED | NOT IMPLEMENTED | NOT STARTED |

Typography: FAIL — No Google Font loaded. All pages use browser default sans-serif.

darkMode activation: FAIL — tailwind.config.ts does not set darkMode: 'class'. All dark: prefixes are inert. The entire dark mode system is built but never activates.

---

## 9. Phase 4 Implementation Matrix

### Phase 4.1 — Activate Authentication (Week 1)

| Step | File | Action |
|---|---|---|
| 4.1.1 | .env | Add NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET |
| 4.1.2 | src/app/layout.tsx | Add SessionProvider wrapper from next-auth/react |
| 4.1.3 | src/middleware.ts | Replace cookie check with getToken() from next-auth/jwt; extend matcher to include /submit and /api/articles |
| 4.1.4 | prisma/seed.ts | Add passwordHash: await bcrypt.hash('seed-password', 10) to all seed users |
| 4.1.5 | src/app/login/page.tsx | Implement role-based post-login redirect using signIn() result + getSession() |
| 4.1.6 | src/app/submit/page.tsx | Remove authorId form field; derive from useSession().data.user.id |
| 4.1.7 | src/app/editor/page.tsx | Add getServerSession(authOptions) check; redirect if role !== EDITOR |
| 4.1.8 | src/app/reviewer/page.tsx | Derive reviewerId from session; remove ?id= URL param |

---

### Phase 4.2 — File Upload Integration (Week 1-2)

| Step | File | Action |
|---|---|---|
| 4.2.1 | Supabase dashboard | Create Storage bucket 'manuscripts' with public read, authenticated write |
| 4.2.2 | .env | Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY |
| 4.2.3 | src/app/api/upload/route.ts | [NEW] POST endpoint that accepts multipart/form-data, uploads to Supabase Storage, returns public URL |
| 4.2.4 | src/app/submit/page.tsx | Replace pdfUrl text input with file input accept=".pdf", wire to upload endpoint, store returned URL |

---

### Phase 4.3 — Paystack APC Payment Gateway (Week 2-3)

Architecture overview:

  Author submits form -> /api/checkout/initiate
    -> Validates form data (no DB write yet)
    -> Calls Paystack: POST https://api.paystack.co/transaction/initialize
    -> Returns { authorization_url, reference }
    -> Client redirects to Paystack hosted checkout

  Paystack callback -> /api/checkout/verify?reference=xxx
    -> Calls Paystack: GET https://api.paystack.co/transaction/verify/{reference}
    -> If status === 'success': create Article in DB (status: SUBMITTED)
    -> Redirect to /submit/success
    -> If failed: redirect to /checkout/[articleId]?error=payment_failed

| Step | File | Action |
|---|---|---|
| 4.3.1 | .env | Add PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY, APC_AMOUNT_KOBO (e.g. 5000000 = 50,000 NGN) |
| 4.3.2 | src/lib/paystack.ts | [NEW] Paystack helper: initializeTransaction(email, amount, metadata) and verifyTransaction(reference) using native fetch |
| 4.3.3 | src/app/api/checkout/initiate/route.ts | [NEW] POST — accepts article metadata + author email; calls initializeTransaction; returns authorization_url |
| 4.3.4 | src/app/api/checkout/verify/route.ts | [NEW] GET — accepts ?reference=; calls verifyTransaction; if success creates Article record; redirects to confirmation |
| 4.3.5 | src/app/checkout/[articleId]/page.tsx | [IMPLEMENT] Paystack Inline JS popup or hosted redirect UI; displays article summary and APC amount |
| 4.3.6 | src/app/submit/page.tsx | [MODIFY] Remove direct POST /api/articles; submit to POST /api/checkout/initiate and follow authorization_url |
| 4.3.7 | src/app/submit/success/page.tsx | [NEW] Post-payment confirmation page |

Waiver bypass flow: If a valid apcTokenCode is present, skip initiate entirely and go directly to POST /api/articles with the token — existing transaction logic handles atomic token redemption.

---

### Phase 4.4 — Global Design System Fixes (Week 1, parallel with auth work)

| Step | File | Action |
|---|---|---|
| 4.4.1 | tailwind.config.ts | Add darkMode: 'class' |
| 4.4.2 | src/app/globals.css | Add Google Fonts import (Inter), set font-family on body |
| 4.4.3 | src/app/layout.tsx | Apply font variable class to html element, add suppressHydrationWarning |
| 4.4.4 | src/app/archive/page.tsx | Add dark: token pairs throughout; add navigation header |
| 4.4.5 | src/app/login/page.tsx | Add dark: token pairs to all elements |
| 4.4.6 | src/app/page.tsx | Implement mobile navigation menu (client component) |
| 4.4.7 | src/components/Navigation.tsx | [IMPLEMENT] Shared navigation component to replace per-page headers |
| 4.4.8 | All page headers | Unify nav using Navigation.tsx component |

---

### Phase 4.5 — Schema & Data Integrity Hardening (Week 2)

| Step | File | Action |
|---|---|---|
| 4.5.1 | prisma/schema.prisma | Add @@unique([articleId, reviewerId]) to ReviewAssignment to enforce DB-level uniqueness |
| 4.5.2 | prisma/schema.prisma | Add updatedAt DateTime @updatedAt to ReviewAssignment |
| 4.5.3 | src/app/api/reviews/submit/route.ts | Add guard: if assignment.status === 'COMPLETED' return 409 Conflict |
| 4.5.4 | src/app/article/[id]/page.tsx | Add status: 'PUBLISHED' guard; call notFound() for non-published articles |
| 4.5.5 | All API routes | Add getServerSession / JWT verification to every mutating endpoint |

---

### Phase 4.6 — Email Notification System (Week 3-4)

| Step | File | Action |
|---|---|---|
| 4.6.1 | .env | Add RESEND_API_KEY (or SMTP credentials for Nodemailer) |
| 4.6.2 | src/lib/email.ts | [NEW] Email helper functions using Resend or Nodemailer |
| 4.6.3 | POST /api/articles | Send confirmation email to author after submission |
| 4.6.4 | POST /api/reviews | Send assignment email to reviewer after assignment |
| 4.6.5 | POST /api/articles/decision | Send decision notification email to author |
| 4.6.6 | POST /api/reviews/submit | Send review-complete notification to editor |

---

## 10. Critical Defects & Open Issues Register

| ID | Severity | Location | Description |
|---|---|---|---|
| BUG-001 | CRITICAL | src/middleware.ts | Route protection uses plain cookie check — trivially bypassable |
| BUG-002 | CRITICAL | .env | NEXTAUTH_SECRET missing — NextAuth throws in non-development environments |
| BUG-003 | CRITICAL | src/app/submit/page.tsx | authorId is a manual text field — auth bypass exists |
| BUG-004 | CRITICAL | All API routes | No authentication on any mutating endpoint |
| BUG-005 | HIGH | tailwind.config.ts | darkMode: 'class' absent — all dark: utility classes are inert across entire app |
| BUG-006 | HIGH | src/app/page.tsx | Submit Manuscript nav and footer links point to /dashboard/author/submit (404) |
| BUG-007 | HIGH | src/app/archive/page.tsx | Sidebar filter buttons have no click handlers — filters are entirely non-functional |
| BUG-008 | HIGH | prisma/seed.ts | All seed users have no passwordHash — cannot test credentials login out-of-the-box |
| BUG-009 | HIGH | src/app/article/[id]/page.tsx | Unpublished articles publicly accessible if UUID is known |
| BUG-010 | HIGH | src/app/api/reviews/submit/route.ts | No guard against re-submitting an already-completed review |
| BUG-011 | MEDIUM | src/app/layout.tsx | No SessionProvider — useSession() calls will fail across all client components |
| BUG-012 | MEDIUM | src/app/login/page.tsx | No role-based redirect after login — all users land at /submit |
| BUG-013 | MEDIUM | src/app/globals.css | No font-family defined — all pages use browser default fonts |
| BUG-014 | MEDIUM | src/app/archive/page.tsx | No dark: token pairs — page breaks the Phase 3 design system |
| BUG-015 | MEDIUM | src/app/page.tsx | Mobile hamburger button has no state or handler — dead UI element |
| BUG-016 | MEDIUM | src/components/Navigation.tsx | File is 0 bytes — intended global nav component not implemented |
| BUG-017 | MEDIUM | src/components/Sidebar.tsx | File is 0 bytes — dashboard sidebar not implemented |
| BUG-018 | MEDIUM | src/app/checkout/[articleId]/page.tsx | File is 0 bytes — Paystack checkout not implemented |
| BUG-019 | LOW | prisma/schema.prisma | ReviewAssignment lacks DB-level @@unique([articleId, reviewerId]) constraint |
| BUG-020 | LOW | src/app/reviewer/page.tsx | Reviewer UUID exposed via URL query param — should derive from session |

---

*End of Report — NJPST Application Status v1.0 | Audit Date: 07 July 2026*
