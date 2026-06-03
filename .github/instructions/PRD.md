### Phase 1 System Documentation 

This section maps out the fundamental data blueprints, entity relationships, and core logic engines required for the Next.js/React framework. This forms the universal backbone of the Product Requirements Document (PRD), ensuring the system handles data with strict relational integrity before any code is generated.

---

#### 1. System Entity Model (Conceptual Data Dictionary)

To support a secure multi-tenant publishing workflow, the application requires five core data objects. Every entity must be strictly typed and controlled by application-level validation rules.

##### Entity A: User Profile

* **Purpose:** Governs identities, authorization rules, and administrative profiles across the entire system.
* **Core Attributes:**
* *Global Unique Identifier (UUID v4):* Alpha-numeric string used as a primary system key.
* *Primary Email Address:* Unique, verified text string used for system authentication and transactional alerts.
* *Full Legal Name:* Text string formatted explicitly for academic indexing citations.
* *System Access Role:* Strict classification constrained to one of four states: `READER`, `AUTHOR`, `REVIEWER`, or `EDITOR`.
* *Institutional Affiliation:* Text field documenting university or research center origins for citation records.
* *Account Creation Log:* Accurate system timestamp.



##### Entity B: Article / Manuscript Record

* **Purpose:** Represents the core scientific research asset throughout its lifecycle from submission to open-access publication.
* **Core Attributes:**
* *Article Unique Identifier (UUID v4):* Distinct tracking key.
* *Title & Structural Abstract:* Long-form text fields optimized for database search queries.
* *Keywords Array:* Collection of short text strings used for search indexing (e.g., "geopolymerization", "polypropylene").
* *Secure Asset Storage Reference:* Encrypted URI pointing to the full-text searchable PDF file within the secure cloud bucket.
* *Workflow Status State:* Strict classification restricted to: `SUBMITTED`, `UNDER_REVIEW`, `REJECTED`, or `PUBLISHED`.
* *Persistent Digital Object Identifier (DOI):* Nullable unique text field populated only upon formal issue publication.
* *Author Reference Identifier:* Link to the User Profile that uploaded the manuscript.



##### Entity C: Peer Review Assignment

* **Purpose:** Handles the trackable processing steps of the blind evaluation pipeline while preserving complete anonymity.
* **Core Attributes:**
* *Assignment Unique Identifier:* Distinct database tracking key.
* *Article Reference Identifier:* Relates the review explicitly to a single manuscript.
* *Reviewer Reference Identifier:* Relates the review to an assigned evaluator profile.
* *Evaluation Status:* State restricted to: `PENDING`, `ACCEPTED`, `COMPLETED`, or `DECLINED`.
* *Anonymized Feedback Matrix:* Structured fields separating comments intended strictly for editors from comments passed back to authors.
* *Quantitative Recommendation Score:* Enumeration for editor tracking (e.g., `ACCEPT_AS_IS`, `MINOR_REVISIONS`, `MAJOR_REVISIONS`, `REJECT`).



##### Entity D: Academic Volume & Issue

* **Purpose:** Manages the compilation and chronological structuring of papers into sequential journal issues.
* **Core Attributes:**
* *Issue Unique Identifier:* Primary database grouping key.
* *Volume Number:* Integer representing the operational year of the journal.
* *Issue Number:* Integer representing the specific biannual publication window.
* *Release Status:* Binary state restricted to `DRAFT` or `PUBLISHED`.
* *Publication Date:* Target or active release timestamp.



##### Entity E: APC Token & Transaction Record

* **Purpose:** Governs financial validation rules, authorization states for PIN member discounts, and Paystack/Flutterwave transaction ledger items.
* **Core Attributes:**
* *Transaction Unique Identifier:* System tracking key.
* *Verification Code Token (Option B):* Unique alpha-numeric hash issued by PIN administrators to authenticate active membership discounts.
* *Token Redemption Status:* Boolean value enforcing single-use strict validation.
* *Currency Designation:* String indicator enforcing standard financial tiers (`NGN` or `USD`).
* *Settlement Amount:* Numeric value recording actual fees captured.
* *Gateway Transaction Reference:* External unique ID provided by the payment aggregator api for reconciliation.



---

#### 2. Entity Relationship & Cardinality Maps

The universal data system operates on a relational graph model to guarantee data traceability. The relationships between objects are governed by the following business constraints:

* **User to Article (One-to-Many):** A single User (acting as an Author) can submit multiple distinct manuscripts over time. However, each unique manuscript record is owned and tracked via a single primary submitter profile.
* **Article to Review Assignment (One-to-Many):** To meet Scopus standards, each single manuscript under evaluation must be linked to at least two or more separate Peer Review Assignment records. A Review Assignment belongs exclusively to one single article tracking pipeline.
* **User to Review Assignment (One-to-Many):** A single User (acting as a Reviewer) can evaluate multiple assigned manuscripts across different issues. Each specific Review Assignment record tracks the metrics of exactly one reviewer.
* **Issue to Article (One-to-Many):** An individual published Volume/Issue contains a group of multiple edited articles. A manuscript remains unaffiliated with an issue until its status is changed to `PUBLISHED`, at which point it is locked into exactly one issue container.

---

#### 3. State Machine & Finite Workflow Logic

An article moves through the system according to strict transition rules. The diagrammatic process table below maps out the allowed database changes, preventing manual errors and unauthorized changes:

| Initial State | Trigger Event | Authorized Actor | Verification Checks | Target State |
| --- | --- | --- | --- | --- |
| **None** | Initial File Upload & Meta Entry | Authenticated Author | Complete metadata fields filled; Valid PDF format uploaded. | `SUBMITTED` |
| `SUBMITTED` | Anti-Plagiarism Threshold Verification | System Webhook / Editor | Plagiarism report score under permissible percentage limits. | `UNDER_REVIEW` |
| `UNDER_REVIEW` | Rejection Recommendation Decision | Assigned Journal Editor | Minimum two reviewer critiques submitted and finalized. | `REJECTED` |
| `UNDER_REVIEW` | Multi-Tier APC Checkout Settlement | Gateway Webhook / Author | Transaction settled via Paystack/Flutterwave; Member token validated. | `PUBLISHED` (Pending Lock) |

---

#### 4. Financial Tier Processing Logic Flow

The engine evaluates checkouts deterministically through a cascading sequence of validation logic steps before rendering the final checkout screen or handshaking with external payment gateway APIs:

```
[Start Checkout Process]
          │
          ▼
Is the Author International? ──(Yes)──► Set Currency: USD ──► Total: $150 ──► [Initiate Gateway]
          │
         (No)
          │
          ▼
Was a Token Code Provided? ──(No)──► Set Currency: NGN ──► Total: ₦55,000 ──► [Initiate Gateway]
          │
         (Yes)
          │
          ▼
Query database for Token
          │
    ┌─────┴────────────────────────┐
    ▼                              ▼
Token Invalid/Redeemed?     Token Valid & Active?
    │                              │
  (Yes)                           (Yes)
    │                              │
    ▼                              ▼
Reject Checkout Request      Mark Token as Redeemed
                             Set Currency: NGN
                             Total: ₦35,000
                                   │
                                   ▼
                           [Initiate Gateway]

```

---

#### 5. Search Engine & Discovery Data Mapping

To resolve the "Visibility Gap," database queries from the advanced search interface must directly cross-reference indexing properties.

When a user searches for key materials terms (e.g., *"indigenous minerals"* or *"tropical fibers"*), the system core map executes a weighted full-text keyword indexing search prioritizing attributes in this exact operational order:
`Article.keywords` $\rightarrow$ `Article.title` $\rightarrow$ `Article.abstract`.

This guarantees that search extraction crawlers and physical human researchers can find specific regional polymer research papers immediately without front-end processing lag.

---



### Phase 2: Technical architecture for the Nigerian Journal of Polymer Science and Technology (NJPST) platform.

---

### 1. Database Architecture (PostgreSQL via Prisma)

Every data point must be strictly typed to ensure the system never crashes due to malformed data during publication or payment processing.

#### Table: `User`

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | UUID | **Primary Key**, auto-generated via UUID v4. |
| `email` | String | **Unique**, cannot be null. Used for NextAuth login. |
| `name` | String | Cannot be null. Formatted for citation output. |
| `role` | Enum | Default: `READER`. Allowed: `AUTHOR`, `REVIEWER`, `EDITOR`. |
| `affiliation` | String | Nullable. University or corporate sponsor name. |
| `createdAt` | DateTime | Default: `now()`. |

#### Table: `Article`

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | UUID | **Primary Key**. |
| `title` | String | Cannot be null. Indexed for search. |
| `abstract` | Text | Cannot be null. Long-form string. |
| `keywords` | String[] | Array of strings (e.g., `["polymer", "latex"]`). |
| `pdfUrl` | String | Cannot be null. Secure AWS S3/Cloud storage URL. |
| `status` | Enum | Default: `SUBMITTED`. Allowed: `UNDER_REVIEW`, `REJECTED`, `PUBLISHED`. |
| `doi` | String | **Unique**, Nullable. Populated via Crossref API upon publication. |
| `authorId` | UUID | **Foreign Key** referencing `User.id`. |
| `issueId` | UUID | **Foreign Key** referencing `Issue.id`. Nullable until published. |
| `createdAt` | DateTime | Default: `now()`. Used for Highwire Press publication date tags. |
| `updatedAt` | DateTime | Auto-updated on record modification. |

#### Table: `ReviewAssignment`

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | UUID | **Primary Key**. |
| `articleId` | UUID | **Foreign Key** referencing `Article.id`. |
| `reviewerId` | UUID | **Foreign Key** referencing `User.id`. |
| `status` | Enum | Default: `PENDING`. Allowed: `ACCEPTED`, `COMPLETED`, `DECLINED`. |
| `editorFeedback` | Text | Nullable. Private notes meant strictly for the Editor. |
| `authorFeedback` | Text | Nullable. Anonymized notes passed to the Author. |
| `recommendation` | Enum | Nullable. Allowed: `ACCEPT`, `MINOR_REVISIONS`, `REJECT`. |

#### Table: `Issue` (Academic Volume)

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | UUID | **Primary Key**. |
| `volume` | Integer | Represents the year (e.g., Volume 15). |
| `issueNumber` | Integer | Represents the biannual release (e.g., Issue 1 or 2). |
| `status` | Enum | Default: `DRAFT`. Allowed: `PUBLISHED`. |
| `publishedAt` | DateTime | Nullable. Set when the editor formally releases the issue. |

#### Table: `ApcToken` (Financial Processing)

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| `id` | UUID | **Primary Key**. |
| `tokenCode` | String | **Unique**, securely hashed alpha-numeric string. |
| `isRedeemed` | Boolean | Default: `false`. Flips to true upon successful checkout. |
| `createdAt` | DateTime | Default: `now()`. |

---

### 2. Pages Architecture (Next.js App Router)

Next.js 14+ uses a file-system-based router. We will split pages strictly between **Server Components** (for SEO and data fetching) and **Client Components** (for interactive forms).

* **`/app/page.tsx`**
* *Type:* Server Component.
* *Purpose:* The public homepage. Fetches the latest published `Issue` and displays PIN corporate branding and Scopus compliance statements.


* **`/app/archive/page.tsx`**
* *Type:* Server Component.
* *Purpose:* The 30-year digitized bulk repository. Includes faceted search input components to filter articles by `keywords` or `volume`.


* **`/app/article/[id]/page.tsx`**
* *Type:* Server Component.
* *Purpose:* The dedicated article landing page. Crucially, this injects the `citation_title` and `DC.Title` metadata tags into the `<head>` for Google Scholar indexing.


* **`/app/dashboard/author/submit/page.tsx`**
* *Type:* Client Component (requires `useState` and `onSubmit`).
* *Purpose:* The multi-step manuscript upload funnel. Handles file attachments, metadata entry, and plagiarism declaration.


* **`/app/dashboard/reviewer/[assignmentId]/page.tsx`**
* *Type:* Client Component.
* *Purpose:* The double-blind review interface. Displays the anonymized PDF and provides a form to submit `editorFeedback` and `authorFeedback`.


* **`/app/checkout/[articleId]/page.tsx`**
* *Type:* Client Component.
* *Purpose:* Renders the APC payment gateway. Takes the `tokenCode` input for PIN members and mounts the Paystack/Flutterwave inline script.



---

### 3. API Architecture (Next.js Route Handlers)

These endpoints handle the backend logic, database mutations, and third-party API handshakes.

* **`POST /api/articles/submit`**
* *Payload:* `{ title, abstract, keywords, pdfFileUrl, authorId }`
* *Action:* Creates a new `Article` record.
* *Integrity Note:* Triggers a background webhook to the iThenticate API for plagiarism scanning.


* **`POST /api/apc/calculate`**
* *Payload:* `{ isInternational, couponCode }`
* *Action:* Calculates the exact APC tier (₦35k / ₦55k / $150). Validates `ApcToken` redemption status.


* **`POST /api/webhooks/payment`**
* *Payload:* `{ event, data: { reference, status, metadata } }` (From Paystack/Flutterwave)
* *Action:* A secure listener. When a successful payment event hits this route, it flips the `Article.status` to `PUBLISHED` and marks the `ApcToken` as `isRedeemed = true`.


* **`POST /api/doi/mint`**
* *Payload:* `{ articleId }`
* *Action:* Restricted to `EDITOR` role. Generates an XML payload of the article's metadata and sends it to the Crossref REST API to register a permanent DOI.


* **`GET /api/oai-pmh`**
* *Payload:* Query parameters (`verb`, `metadataPrefix`)
* *Action:* Outputs a standardized XML feed of all published articles so African Journals Online (AJOL) can harvest the journal's metadata automatically.



---

### 4. "Etc" (Middleware, Security & Storage)

* **Route Protection (`middleware.ts`):**
* We will implement NextAuth.js middleware at the root of the project. It will intercept every request to `/app/dashboard/*` and read the user's JSON Web Token (JWT). If a `READER` tries to access `/app/dashboard/editor`, the middleware instantly redirects them to a 403 Access Denied page before the server even renders the HTML.


* **Secure Asset Storage (AWS S3):**
* Raw manuscripts (`UNDER_REVIEW`) are stored in a private S3 bucket. Our API will generate "Presigned URLs" (temporary links that expire in 15 minutes) for Reviewers, ensuring that unpublished manuscripts cannot be leaked or indexed prematurely.


* **Database Migrations:**
* Controlled strictly via Prisma CLI (`npx prisma migrate deploy`). This ensures that changes to the schema (like adding a new indexing tag) are version-controlled and safely applied to the PostgreSQL database without dropping existing NJPST archives.

#### Directory Tree Configuration

src/
├── app/
│   ├── layout.tsx                 # Root layout: injects HTML shell, global fonts, and base headers
│   ├── page.tsx                   # NJPST Homepage: highlights PIN branding & latest volumes
│   ├── archive/
│   │   └── page.tsx               # Search repository: houses faceted material keyword filters
│   ├── article/
│   │   └── [id]/
│   │       └── page.tsx           # Indexing landing page: injects Highwire Press/Dublin Core meta
│   ├── checkout/
│   │   └── [articleId]/
│   │       └── page.tsx           # APC Checkout interface: mounts local/international payment widgets
│   ├── dashboard/
│   │   ├── layout.tsx             # Protected layout wrapper: provisions role-based navigation sidebar
│   │   ├── author/
│   │   │   └── submit/
│   │   │       └── page.tsx       # Author panel: multi-step manuscript submission form
│   │   ├── reviewer/
│   │   │   └── [assignmentId]/
│   │   │       └── page.tsx       # Reviewer terminal: handles scrubbed double-blind inputs
│   │   └── editor/
│   │       └── page.tsx           # Editorial dashboard: dispatches manual review actions & Crossref APIs
│   └── api/                       # (Route Handlers detailed in previous phase)
└── components/                    # Global UI atomic layout fragments
    ├── Navigation.tsx             # Public top-bar menu system
    ├── Sidebar.tsx                # Dashboard side navigation matching user permissions
    └── AdWidget.tsx               # Rotational banner system for corporate sponsors



### 4. Security & Role-Based Access Control (RBAC) Matrix

To comply with Scopus standards and maintain data integrity, access to specific entity states must be locked at the system router level. The matrix below defines the explicit permission parameters across the database tables for each of the four roles:

| Database Entity | Reader | Author | Reviewer | Editor |
| --- | --- | --- | --- | --- |
| **`User Profile`** | Read Only (Public Profiles) | Read/Write (Own Profile) | Read/Write (Own Profile) | Full Access (Read/Write/Modify Roles) |
| **`Article / Manuscript`** | Read Only (Only if status is `PUBLISHED`) | Read/Write (Own Submissions; Blocked from editing if `UNDER_REVIEW`) | Read Only (Anonymized files assigned to them; Blocked from seeing author metadata) | Full Access (Can modify status, assign elements, link to Volumes) |
| **`ReviewAssignment`** | No Access | No Access (Can only view final anonymized author feedback field) | Read/Write (Can view assigned manuscript, edit feedback fields, select recommendation score) | Full Access (Can create assignments, view editor-only private notes) |
| **`Academic Volume`** | Read Only (Only if status is `PUBLISHED`) | Read Only (Only if status is `PUBLISHED`) | Read Only (Only if status is `PUBLISHED`) | Full Access (Can create new volume drafts, compile issues, and toggle live visibility) |
| **`ApcToken / Payments`** | No Access | Read/Write (Can input single-use verification token to modify checkout balances) | No Access | Read/Write (Can pre-generate system discount codes for validated PIN members) |

---

### 5. Transactional Notification & Webhook Event Matrix

Because live chatting is completely out of scope for Version 1, the system relies on asynchronous state-triggered transactional notifications. The system engine must fire targeted email payloads immediately when the following database mutations occur:

#### 1. Mutation Event: `Article Created` (Status: `SUBMITTED`)

* **Trigger:** Author completes the multi-step file attachment pipeline and saves the manuscript record.
* **System Action:** Fired immediately.
* **Dispatches:**
* *To Author:* Confirmation receipt including unique tracking reference ID, article metadata log, and processing timeline expectations.
* *To Editor:* Administrative alert flag notifying the editorial panel that a new manuscript is waiting for initial triage and anti-plagiarism confirmation.



#### 2. Mutation Event: `Review Assignment Dispatched` (Status: `PENDING`)

* **Trigger:** Editor matches an anonymized manuscript record with a specific reviewer profile in the dashboard backend.
* **System Action:** Fired immediately.
* **Dispatches:**
* *To Reviewer:* Invitation link showing the paper abstract, keywords, and evaluation deadline constraints. Author metadata fields are strictly stripped from the email template structure.



#### 3. Mutation Event: `Review Evaluation Finalized` (Status: `COMPLETED`)

* **Trigger:** Reviewer updates their designated assignment row with their score and feedback matrices, and clicks "Submit Critique."
* **System Action:** Fired immediately.
* **Dispatches:**
* *To Editor:* Management notification showing that an active review block has been completed, detailing both private editor notes and anonymous author feedback fields.



#### 4. Mutation Event: `Payment Settlement Confirmed` (Status Transitions to `PUBLISHED`)

* **Trigger:** External payment gateway webhook hits the API (`/api/webhooks/payment`) indicating full settlement of the tiered APC fee, or an editor manually clears a waiver.
* **System Action:** Post-payment hook.
* **Dispatches:**
* *To Author:* Automated invoice statement along with confirmation that the article has been successfully assigned to the active live issue, minting the persistent Crossref DOI.



### Phase 3 UI/UX Design System & Styling Architecture 

To maintain a professional, distraction-free environment for scientific reading and peer review, the application will enforce a strict **Monochromatic Design System** built on a Royal Blue foundation.

#### 1. The Monochromatic Color Palette (Tailwind Mapping)

By using a single hue and calculating its lightness/darkness steps, we ensure perfect visual harmony. No secondary or tertiary brand colors will be introduced.

* **The Base Hue (Primary):** Royal Blue (`#2563EB` / Tailwind `blue-600`).
* **Deep Shades (For Typography & Nav Backgrounds):**
* `blue-950` (`#172554`): Used for all primary heading text and the structural dashboard sidebar. Replaces pure black to maintain color harmony.
* `blue-900` (`#1E3A8A`): Used for standard body text in Light Mode.


* **Light Tints (For Backgrounds & Card Borders):**
* `blue-50` (`#EFF6FF`): Used as the default page background to reduce eye strain compared to stark white.
* `blue-100` (`#DBEAFE`): Used for subtle card borders, table row highlights, and input field backgrounds.



#### 2. Call-to-Action (CTA) Strategy

Since we are avoiding a "color riot" (meaning no contrasting oranges or bright greens), we will achieve high-visibility CTAs through strict contrast ratios and saturation techniques within the blue scale.

* **Primary CTAs (e.g., "Submit Manuscript", "Process Payment"):** Solid `blue-600` background with pure white (`#FFFFFF`) text, paired with a subtle drop shadow to lift it off the page.
* **Secondary Actions (e.g., "Download PDF", "Cancel"):** Ghost buttons utilizing a transparent background with a `blue-600` text and border outline.

#### 3. Responsive Dark/Light Theme Engine

The application will not rely on a manual toggle switch. Instead, it will read the user's native device preferences to render the optimal reading environment.

* **Implementation:** We will configure Tailwind's `darkMode: 'media'` strategy.
* **Light Mode (Default):** Soft `blue-50` backgrounds, white article cards, and deep `blue-950` text.
* **Dark Mode (Triggered by System):** Deep `blue-950` or off-black backgrounds, dark `blue-900` article cards, and high-legibility `blue-50` off-white text. CTAs will invert to bright `blue-400` to maintain visibility against dark backgrounds.

#### 4. Typography Scale

To ensure academic readability across mobile screens and desktop monitors, we will use a highly legible, modern sans-serif stack optimized for dense data.

* **Primary Font Stack:** Inter (or standard system sans-serif like San Francisco/Roboto).
* **Base Size:** `16px` for optimal mobile reading, scaling dynamically based on Tailwind's `prose` typography plugin for long-form abstracts.



### 1. The Top Navigation (Header)

* **LHS (Left Hand Side):** The Polymer Institute of Nigeria (PIN) logo next to the bold "NJPST" acronym. This establishes immediate institutional trust.
* **RHS (Right Hand Side):** Clean, text-based navigation links. We will include "Current Issue", "Archive", "Submit Manuscript" (highlighted as a subtle button), and "Login".

### 2. The Hero Section (The "Middle")

* **Visuals:** Instead of a busy background like in "image_475528.png", we will use a crisp, soft `blue-50` background to maintain our professional reading environment.
* **Typography:** A massive, bold `blue-950` headline (e.g., "Advancing Polymer Science & Technology").
* **Description:** A concise sub-headline underneath, stating the journal's mission, open-access status, and indexing goals.
* **The Search Bar:** Directly below the description, we should place a massive, full-width search input (just like the bottom of the reference image). This allows global researchers to instantly query the database for specific keywords or authors.

### 3. The Trust Banner (New UI Improvement)

* **Feature:** A slim, full-width horizontal bar just below the hero section.
* **Content:** This will feature three or four key metrics or badges to satisfy NUC and Scopus requirements, such as "Gold Open Access", "Double-Blind Peer Reviewed", and "Crossref DOI Enabled".

### 4. Main Content: "Latest Article" / Current Volume

* **Improvement:** Instead of just showing one article cover, we can design a "Featured Volume" split-card.
* **Left Side:** The high-quality cover image of the latest journal volume.
* **Right Side:** The title of the volume (e.g., *Volume 15, Issue 2*), followed by a quick list of the top 3 published articles within it. We can add a high-contrast `blue-600` Call-to-Action (CTA) button reading "View Full Volume".

### 5. The Footer

* **Content:** A dark `blue-950` block at the bottom.
* **Elements:** It will house the copyright information, links to the editorial board, author guidelines, and the strict indexing compliance statements required by platforms like AJOL and Google Scholar.

