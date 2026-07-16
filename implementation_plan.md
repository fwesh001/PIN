# Hybrid Next.js + OJS Migration — Implementation Plan

> Migrate the NJPST platform from a monolithic Next.js + Prisma/PostgreSQL stack to a **Hybrid Headless Architecture** where OJS (Open Journal Systems) handles all editorial workflow, user management, peer-review, and data storage, while Next.js remains the public-facing frontend.

---

## Current State Summary

The app is a **monolithic Next.js 14 application** with:
- **Prisma ORM** + local PostgreSQL for all data (users, articles, reviews, issues, APC tokens)
- **NextAuth.js** with Credentials + Google providers for auth
- **Custom API Route Handlers** for every backend operation (submit article, assign reviewer, editorial decisions, checkout/payment, upload)
- **Server Components** fetching directly from Prisma on every page
- **Tailwind CSS** for styling (monochromatic royal blue design system)
- **~17 React components**, **6 API route directories**, **5 Prisma models**, and **role-based middleware**

---

## Target Architecture

```
+------------------------------------------+        +------------------------------------------+
|            NEXT.JS FRONTEND              |        |               OJS BACKEND                |
|        (React / TypeScript / UI)         |        |             (PHP / MySQL)                |
+------------------------------------------+        +------------------------------------------+
|  • Homepage / Landing Page               |        |  • Editor / Author Login Portal          |
|  • "About the Journal" & Ethics Pages    | <----> |  • Multi-step Manuscript Submission Form  |
|  • Editorial Board Directory             |  REST  |  • Peer-Reviewer Assignment Workflow      |
|  • Published Article / Issue Archives    |  API   |  • Secure Database (Articles & Users)     |
|  • Custom PDF Viewer / Reading Rooms     |        |  • Core Role Separation Guardrails       |
+------------------------------------------+        +------------------------------------------+
         njpst.polymerinstitute.org.ng                   journal.polymerinstitute.org.ng
              (Next.js on Vercel)                          (OJS on PHP/MySQL server)
```

> [!IMPORTANT]
> **Core Principle**: We will NOT rebuild submission forms, review workflows, or role-blinding logic in Next.js. OJS handles these natively and doing so introduces security risks. The Next.js frontend is purely for the public-facing reading experience and SEO.

---

## User Review Required

> [!WARNING]
> **Breaking Change — Complete Backend Replacement**: This migration removes the entire Prisma/PostgreSQL backend, all custom API routes, authentication system, and the editorial/reviewer dashboards from Next.js. Users will be redirected to the OJS subdomain for all authenticated workflows (submit, review, edit).

> [!IMPORTANT]
> **OJS Hosting Decision Required**: You need to decide on an OJS hosting strategy before we begin:
> - **Option A**: Self-hosted on a VPS (e.g., DigitalOcean, Hetzner) — Full control, requires PHP 8.2+, MySQL 8+, Apache/Nginx
> - **Option B**: Managed OJS hosting via [PKP Publishing Services](https://pkpservices.sfu.ca/) — Zero maintenance, monthly fee
> - **Option C**: Docker-based deployment — Good for dev/testing, can be promoted to production

Ans: Option C for now then Option for production

---

## Open Questions

> [!IMPORTANT]
> 1. **OJS Subdomain**: Confirm the subdomain URL for the OJS backend (e.g., `journal.polymerinstitute.org.ng` or `submit.polymerinstitute.org.ng`)?

pinjournal.org 

> 2. **Payment Gateway**: OJS has native payment support via plugins. Do you want to keep Paystack/Flutterwave integration, or use the OJS built-in payment module? The OJS payment plugin can handle APC tiers natively.

use ojs built-in system

> 3. **Existing Data**: Is there any real production data in the current PostgreSQL database that needs to be migrated to OJS, or is it all seed/test data?

All seed no real data

> 4. **OJS Version**: The plan assumes OJS 3.4.x (latest stable). Confirm this is acceptable?

yes good

> 5. **Theme Matching**: Do you want a full custom OJS PHP child theme to match the Next.js royal blue design, or is CSS-only injection sufficient for Phase 1?

a full custom OJS PHP child theme to match the Next.js royal blue design
---

## Proposed Changes

The migration is organized into **4 phases**, each with clear file-level changes.

---

### Phase 1: Strip the Hardcoded Backend (Prisma, API Routes, Auth)

All backend logic currently handled by Prisma + custom API routes will be **deleted** since OJS will own this entirely.

---

#### [DELETE] [schema.prisma](file:///c:/Users/zabdiel/Desktop/PIN/prisma/schema.prisma)
The entire Prisma schema (User, Article, ReviewAssignment, Issue, ApcToken, ManuscriptAuthor models). OJS has its own MySQL database schema that handles all of these entities natively.

#### [DELETE] [seed.ts](file:///c:/Users/zabdiel/Desktop/PIN/prisma/seed.ts)
Database seeding script — no longer needed. OJS has its own admin panel for creating users, test data, etc.

#### [DELETE] [prisma.config.ts](file:///c:/Users/zabdiel/Desktop/PIN/prisma.config.ts)
Prisma configuration file — no longer needed.

#### [DELETE] [prisma.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/lib/prisma.ts)
Prisma client singleton — replaced by OJS API fetch utilities.

#### [DELETE] [auth.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/lib/auth.ts)
NextAuth configuration (Credentials + Google providers). Authentication is fully handled by OJS login portal.

#### [DELETE] [email.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/lib/email.ts)
Email stub utility. OJS has built-in transactional email support for all workflow events (submission, review assignment, editorial decision, etc.).

#### [DELETE] [paystack.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/lib/paystack.ts)
Paystack gateway helper. The APC payment flow will either use OJS's native payment plugin or be handled as a separate micro-integration in Phase 4.

#### [DELETE] [uuid.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/lib/uuid.ts)
UUID validation utility — OJS uses its own integer IDs, not UUIDs.

#### [DELETE] [middleware.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/middleware.ts)
NextAuth JWT-based RBAC middleware. Role-based access control is now handled entirely by OJS's native permission system.

---

#### API Route Handlers (ALL DELETED)

Every API route handler is deleted because OJS's REST API and native PHP forms replace them entirely:

| File | Current Purpose | OJS Replacement |
|------|----------------|-----------------|
| [DELETE] [route.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/app/api/articles/route.ts) | `POST /api/articles` — Create manuscript | OJS submission form + `POST /api/v1/submissions` |
| [DELETE] [route.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/app/api/articles/decision/route.ts) | `POST /api/articles/decision` — Editorial decision | OJS editor dashboard handles this natively |
| [DELETE] [route.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/app/api/reviews/route.ts) | `POST /api/reviews` — Assign reviewer | OJS reviewer assignment workflow |
| [DELETE] [route.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/app/api/reviews/submit/route.ts) | `POST /api/reviews/submit` — Submit review | OJS reviewer evaluation form |
| [DELETE] [route.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/app/api/checkout/initiate/route.ts) | `POST /api/checkout/initiate` — APC payment | OJS payment plugin or external micro-service |
| [DELETE] [route.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/app/api/checkout/verify/route.ts) | `GET /api/checkout/verify` — Payment verify | OJS payment plugin callback |
| [DELETE] [route.ts](file:///c:/Users/zabdiel/Desktop/PIN/src/app/api/upload/route.ts) | `POST /api/upload` — File upload | OJS handles file uploads natively in its submission form |
| [DELETE] `src/app/api/upload/avatar/` | Avatar upload | OJS user profile settings |
| [DELETE] `src/app/api/auth/[...nextauth]/` | NextAuth handler | OJS login system |
| [DELETE] `src/app/api/auth/register/` | User registration | OJS registration form |
| [DELETE] `src/app/api/auth/redirect/` | Auth redirect | N/A |
| [DELETE] `src/app/api/user/settings/` | User settings API | OJS user profile |

**Summary**: The entire `src/app/api/` directory tree is deleted.

---

#### Dashboard & Workflow Pages (ALL DELETED)

These are the authenticated editorial/review/author workflow pages that OJS replaces:

| File | Current Purpose | OJS Replacement |
|------|----------------|-----------------|
| [DELETE] [page.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/editor/page.tsx) | Editor dashboard | OJS Editorial Dashboard (`/editor/submissions`) |
| [DELETE] [page.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/reviewer/page.tsx) | Reviewer portal | OJS Reviewer Dashboard (`/reviewer/submissions`) |
| [DELETE] [page.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/dashboard/editor/page.tsx) | Editor re-export | Deleted (OJS) |
| [DELETE] `src/app/dashboard/reviewer/[assignmentId]/` | Review assignment page | OJS review form |
| [DELETE] `src/app/dashboard/author/submit/page.tsx` | Multi-step submission form | OJS native submission wizard |
| [DELETE] `src/app/dashboard/author/submit/success/` | Submission success page | OJS submission confirmation |
| [DELETE] `src/app/dashboard/author/manuscripts/` | Author manuscripts list | OJS author dashboard |
| [DELETE] `src/app/dashboard/author/settings/` | Author settings | OJS user profile |
| [DELETE] [page.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/dashboard/author/page.tsx) | Author dashboard | OJS Author Dashboard |
| [DELETE] [layout.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/dashboard/author/layout.tsx) | Author layout | Deleted |
| [DELETE] [layout.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/dashboard/layout.tsx) | Dashboard layout wrapper | Deleted |
| [DELETE] [page.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/login/page.tsx) | Login page | OJS login form |
| [DELETE] `src/app/auth/redirect/` | Auth redirect page | Deleted |
| [DELETE] `src/app/checkout/[articleId]/` | APC checkout page | OJS payment flow |
| [DELETE] `src/app/checkout/error/` | Payment error page | OJS payment error handling |

**Summary**: The entire `src/app/dashboard/`, `src/app/editor/`, `src/app/reviewer/`, `src/app/login/`, `src/app/auth/`, and `src/app/checkout/` directories are deleted.

---

#### Workflow-Specific Components (ALL DELETED)

These components are tightly coupled to the custom backend and have no purpose in the hybrid architecture:

| File | Purpose | Reason for Deletion |
|------|---------|-------------------|
| [DELETE] [AssignReviewerAction.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/AssignReviewerAction.tsx) | Reviewer assignment dropdown | OJS editor dashboard |
| [DELETE] [EditorialDecisionAction.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/EditorialDecisionAction.tsx) | Accept/reject buttons | OJS editorial workflow |
| [DELETE] [SubmitReviewForm.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/SubmitReviewForm.tsx) | Review submission form | OJS review form |
| [DELETE] [CheckoutClient.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/CheckoutClient.tsx) | Paystack checkout widget | OJS payment plugin |
| [DELETE] [DashboardFilters.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/DashboardFilters.tsx) | Editor search/filter | OJS dashboard filters |
| [DELETE] [AuthorSidebar.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/AuthorSidebar.tsx) | Author navigation sidebar | OJS author sidebar |
| [DELETE] [UploadProgress.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/UploadProgress.tsx) | File upload progress | OJS upload handler |
| [DELETE] [FieldTip.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/FieldTip.tsx) | Form field tooltips | OJS form fields |
| [DELETE] [Sidebar.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/components/Sidebar.tsx) | Dashboard sidebar | OJS sidebar |

---

#### Other Backend-Related Files (DELETED)

| File | Reason |
|------|--------|
| [DELETE] [start_local_db.bat](file:///c:/Users/zabdiel/Desktop/PIN/start_local_db.bat) | Local PostgreSQL startup — no longer needed |
| [DELETE] [stop_local_db.bat](file:///c:/Users/zabdiel/Desktop/PIN/stop_local_db.bat) | Local PostgreSQL shutdown — no longer needed |
| [DELETE] [init.sql](file:///c:/Users/zabdiel/Desktop/PIN/supabase/init.sql) | Supabase SQL init — no longer needed |

---

### Phase 2: Build the OJS API Integration Layer

New files that replace direct Prisma calls with OJS REST API fetch utilities.

---

#### [NEW] `src/lib/ojs/client.ts`
Core OJS API client. A typed `fetch` wrapper that:
- Reads `OJS_API_URL` and `OJS_API_KEY` from server-side environment variables
- Handles pagination (`count`, `offset` params)
- Returns strongly-typed responses
- Includes error handling and retry logic

```typescript
// Example shape:
const OJS_BASE = process.env.OJS_API_URL; // e.g., https://journal.polymerinstitute.org.ng/api/v1
const OJS_KEY  = process.env.OJS_API_KEY;

async function ojsFetch<T>(endpoint: string, options?: RequestInit): Promise<T> { ... }
```

#### [NEW] `src/lib/ojs/types.ts`
TypeScript type definitions for OJS API entities:
- `OJSSubmission` — Maps to OJS submission objects (id, title, abstract, status, dateSubmitted, publications, etc.)
- `OJSIssue` — Maps to OJS issue objects (id, volume, number, year, datePublished, articles, etc.)
- `OJSAuthor` — Maps to OJS author/contributor objects
- `OJSPublication` — The publication record within a submission
- `OJSGalley` — PDF/file attachments
- `OJSUser` — Basic user profile info (for editorial board display)

#### [NEW] `src/lib/ojs/submissions.ts`
Fetch utilities for the OJS Submissions API:
- `getPublishedSubmissions()` → `GET /submissions?status=3` (status 3 = published)
- `getSubmissionById(id)` → `GET /submissions/{id}`
- `searchSubmissions(query)` → `GET /submissions?searchPhrase=...`

#### [NEW] `src/lib/ojs/issues.ts`
Fetch utilities for the OJS Issues API:
- `getPublishedIssues()` → `GET /issues?isPublished=true`
- `getCurrentIssue()` → `GET /issues/current`
- `getIssueById(id)` → `GET /issues/{id}`

#### [NEW] `src/lib/ojs/galleys.ts`
Fetch utilities for PDF/file access:
- `getGalleyFile(submissionId, galleyId)` → Returns the PDF stream URL for rendering

---

### Phase 3: Rewire the Frontend Pages

The public-facing pages are **modified** (not deleted) to fetch from the OJS API instead of Prisma.

---

#### [MODIFY] [page.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/page.tsx) — Homepage

**What changes:**
- Remove all `import { prisma }` and `import { getServerSession }` calls
- Remove Prisma `findMany` / `findFirst` queries
- Replace with OJS API calls: `getPublishedSubmissions()`, `getCurrentIssue()`
- Remove session-based user detection (no more NextAuth on homepage)
- Update "Submit Manuscript" links to point to OJS subdomain (e.g., `https://journal.polymerinstitute.org.ng/submission/wizard`)
- Update "Login" link to point to OJS login page
- Remove `MobileNav` user prop logic (or simplify to a static link)
- Map OJS response shapes to the existing JSX (title, author name, keywords, PDF URL, etc.)

**What stays the same:**
- The entire visual design (hero, trust banner, featured volume, article cards, footer)
- The search form (still points to `/archive`)
- The monochromatic blue design system
- All CSS/Tailwind classes

---

#### [MODIFY] [page.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/archive/page.tsx) — Archive & Search

**What changes:**
- Replace Prisma queries with OJS API calls:
  - `searchSubmissions(q)` for text search
  - `getPublishedIssues()` for the volume filter sidebar
  - `getPublishedSubmissions({ volume, keyword })` for filtered results
- Update data mapping (OJS uses `publications[0].fullTitle` instead of `article.title`, etc.)
- Remove session-based user detection

**What stays the same:**
- The `ArchiveFilters` sidebar component (only needs prop changes)
- The entire visual layout and responsive design

---

#### [MODIFY] `src/app/article/[id]/page.tsx` — Article Landing Page

**What changes:**
- Replace Prisma `findUnique` with `getSubmissionById(id)`
- Map OJS fields to Highwire Press / Dublin Core meta tags
- Update PDF download link to OJS galley file URL
- Remove any Prisma imports

**What stays the same:**
- The SEO meta tag injection strategy
- The reading view layout
- Citation metadata generation

---

#### [MODIFY] [layout.tsx](file:///c:/Users/zabdiel/Desktop/PIN/src/app/layout.tsx) — Root Layout

**What changes:**
- Remove `ToastProvider` import (toast was for dashboard interactions)
- Potentially simplify `ThemeProvider` if it was coupled to auth

**What stays the same:**
- HTML shell, fonts, global CSS

---

#### [MODIFY] [globals.css](file:///c:/Users/zabdiel/Desktop/PIN/src/app/globals.css)
No functional changes needed — the design system stays.

---

#### [MODIFY] [.env](file:///c:/Users/zabdiel/Desktop/PIN/.env) — Environment Variables

**Remove:**
```diff
- DATABASE_URL="postgresql://..."
- DIRECT_URL="postgresql://..."
- NEXTAUTH_SECRET="..."
- NEXTAUTH_URL="..."
- GOOGLE_CLIENT_ID="..."
- GOOGLE_CLIENT_SECRET="..."
- PAYSTACK_SECRET_KEY="..."
- NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="..."
```

**Add:**
```diff
+ # OJS Backend Configuration
+ OJS_API_URL="https://journal.polymerinstitute.org.ng/api/v1"
+ OJS_API_KEY="your-ojs-api-key-here"
+ OJS_BASE_URL="https://journal.polymerinstitute.org.ng"
+
+ # Next.js public variables (for client-side links to OJS)
+ NEXT_PUBLIC_OJS_URL="https://journal.polymerinstitute.org.ng"
```

---

#### [MODIFY] [package.json](file:///c:/Users/zabdiel/Desktop/PIN/package.json) — Dependencies

**Remove these dependencies:**
```diff
- "@prisma/adapter-pg": "^7.8.0"
- "@prisma/client": "^7.8.0"
- "prisma": "^7.8.0"
- "pg": "^8.21.0"
- "bcryptjs": "^3.0.3"
- "@types/bcryptjs": "^2.4.6"
- "next-auth": "^4.24.14"
- "tsx": "^4.22.4"
```

**Remove these scripts:**
```diff
- "db:generate": "prisma generate"
- "db:push": "prisma db push"
- "db:seed": "tsx prisma/seed.ts"
```

**What stays:**
- `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer` and their type packages

---

### Phase 4: OJS Environment Setup & Theme Matching

This phase happens **outside the Next.js codebase** — it's the OJS server setup.

---

#### OJS Server Setup (Manual / DevOps)

1. **Provision a server** with PHP 8.2+, MySQL 8+, Apache or Nginx
2. **Install OJS 3.4.x** from [PKP's GitHub releases](https://github.com/pkp/ojs/releases)
3. **Configure `config.inc.php`**:
   - Set `api_secret_key` to enable REST API token generation
   - Configure SMTP for transactional emails
   - Set `base_url` to the subdomain
4. **Create the journal** via the OJS admin wizard
5. **Configure editorial roles**: Editor-in-Chief, Section Editors, Reviewers
6. **Generate an API key** via User Profile → API Key (for Next.js server-side fetches)
7. **Install plugins**:
   - Crossref DOI registration plugin
   - Google Scholar indexing plugin
   - OAI-PMH metadata harvesting (built-in)
   - Payment plugin (if using OJS native payments)

#### OJS Visual Theme Matching

To make the transition from Next.js → OJS feel seamless:

1. **Extract** the Next.js header/footer HTML + CSS
2. **Create an OJS child theme** (PHP template) or inject custom CSS via OJS Settings → Website → Appearance → Custom CSS
3. Match: fonts (Inter), colors (`blue-600`, `blue-950`, `blue-50`), button styles, header layout
4. The goal is that navigating from the homepage to "Submit Manuscript" feels like the same site

---

## Complete File Inventory

### Files to DELETE (40+ files)

| # | File/Directory | Category |
|---|---------------|----------|
| 1 | `prisma/schema.prisma` | Database |
| 2 | `prisma/seed.ts` | Database |
| 3 | `prisma.config.ts` | Database |
| 4 | `src/lib/prisma.ts` | Database |
| 5 | `src/lib/auth.ts` | Auth |
| 6 | `src/lib/email.ts` | Backend |
| 7 | `src/lib/paystack.ts` | Backend |
| 8 | `src/lib/uuid.ts` | Backend |
| 9 | `src/middleware.ts` | Auth |
| 10 | `src/app/api/` (entire directory) | API — 12+ route files |
| 11 | `src/app/dashboard/` (entire directory) | Dashboard — 8+ files |
| 12 | `src/app/editor/page.tsx` | Dashboard |
| 13 | `src/app/reviewer/page.tsx` | Dashboard |
| 14 | `src/app/login/page.tsx` | Auth |
| 15 | `src/app/auth/` (entire directory) | Auth |
| 16 | `src/app/checkout/` (entire directory) | Payment |
| 17 | `src/components/AssignReviewerAction.tsx` | Workflow |
| 18 | `src/components/EditorialDecisionAction.tsx` | Workflow |
| 19 | `src/components/SubmitReviewForm.tsx` | Workflow |
| 20 | `src/components/CheckoutClient.tsx` | Payment |
| 21 | `src/components/DashboardFilters.tsx` | Dashboard |
| 22 | `src/components/AuthorSidebar.tsx` | Dashboard |
| 23 | `src/components/UploadProgress.tsx` | Workflow |
| 24 | `src/components/FieldTip.tsx` | Workflow |
| 25 | `src/components/Sidebar.tsx` | Dashboard |
| 26 | `start_local_db.bat` | DevOps |
| 27 | `stop_local_db.bat` | DevOps |
| 28 | `supabase/init.sql` | Database |

### Files to MODIFY (6 files)

| # | File | Change Summary |
|---|------|---------------|
| 1 | `src/app/page.tsx` | Replace Prisma queries with OJS API calls; remove auth logic |
| 2 | `src/app/archive/page.tsx` | Replace Prisma queries with OJS API calls |
| 3 | `src/app/article/[id]/page.tsx` | Replace Prisma query with OJS API call |
| 4 | `src/app/layout.tsx` | Remove ToastProvider; simplify |
| 5 | `.env` | Replace DB/Auth vars with OJS API vars |
| 6 | `package.json` | Remove Prisma/Auth/pg dependencies & scripts |

### Files to CREATE (5 files)

| # | File | Purpose |
|---|------|---------|
| 1 | `src/lib/ojs/client.ts` | OJS API fetch client with auth headers |
| 2 | `src/lib/ojs/types.ts` | TypeScript type definitions for OJS entities |
| 3 | `src/lib/ojs/submissions.ts` | Submission-related API fetch utilities |
| 4 | `src/lib/ojs/issues.ts` | Issue-related API fetch utilities |
| 5 | `src/lib/ojs/galleys.ts` | PDF/galley file access utilities |

### Files UNCHANGED (kept as-is)

| File | Reason |
|------|--------|
| `src/components/Icons.tsx` | Pure SVG icons — no backend coupling |
| `src/components/Logo.tsx` | Static logo component |
| `src/components/Navigation.tsx` | Will need minor link updates but core stays |
| `src/components/MobileNav.tsx` | Will need minor link updates |
| `src/components/ThemeProvider.tsx` | Theme switching — no backend coupling |
| `src/components/ThemeToggle.tsx` | Theme toggle button — pure UI |
| `src/components/Toast.tsx` | May be removed or kept for client-side alerts |
| `src/components/ArchiveFilters.tsx` | Kept — only needs prop type adjustments |
| `src/app/globals.css` | CSS design system — unchanged |
| `tailwind.config.ts` | Tailwind configuration — unchanged |
| `tsconfig.json` | TypeScript config — unchanged |
| `postcss.config.mjs` | PostCSS config — unchanged |
| `next-env.d.ts` | Next.js types — unchanged |
| `public/` directory | Static assets — unchanged |
| `.gitignore` | Git config — unchanged |
| All `.md` / `.docx` / `.pdf` docs | Reference documents — unchanged |

---

## Verification Plan

### Automated Tests
- `npm run build` — Verify the Next.js app compiles without errors after all Prisma/auth imports are removed
- `npm run lint` — Ensure no broken imports or unused variables remain

### Manual Verification

1. **Homepage renders** with data from OJS API (or gracefully shows empty states if OJS is not yet live)
2. **Archive search** works — queries the OJS REST API and returns results
3. **Article landing pages** render with correct metadata tags
4. **"Submit Manuscript"** link correctly redirects to the OJS submission portal
5. **"Login"** link correctly redirects to the OJS login page
6. **No 500 errors** — all Prisma-dependent code paths are cleanly removed
7. **OJS portal** is accessible at the configured subdomain and the visual theme matches the Next.js frontend

### Integration Verification
- Confirm OJS API returns data for `GET /api/v1/submissions?status=3`
- Confirm OJS API key authentication works via `Authorization: Bearer <key>` header
- Confirm PDF galley files are accessible from the Next.js article pages
