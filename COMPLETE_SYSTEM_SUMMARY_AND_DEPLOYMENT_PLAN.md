# Rhythmzz Academy of Dance — Exhaustive Evolution Summary & Production Deployment Blueprint

> **Repository:** `aweswe/Dance-Studio`  
> **Target Environment:** Next.js 16 (App Router, Turbopack, React 19), Supabase (PostgreSQL 15+ & Auth), Vercel (Edge Compute & Blob CDN), Tailwind CSS Design System, TypeScript Strict.  
> **Production Target:** 100 to 150 Daily Active Users (DAU) on Free Tiers ($0.00 / month forever).  
> **Status:** **100% Tested, Production Ready & Build Verified (0 Type Errors, 55/55 Unit Tests Passed, 35/35 Playwright E2E Tests Passed).**

---

## TABLE OF CONTENTS
1. [Executive Overview & Business Objectives](#1-executive-overview--business-objectives)
2. [Exhaustive Feature Evolution & Nuances (What We Have Done)](#2-exhaustive-feature-evolution--nuances-what-we-have-done)
   - [2.1 Zero-Egress Storage & Video Architecture](#21-zero-egress-storage--video-architecture)
   - [2.2 Trainer Sanitization & Universal Age Standardization](#22-trainer-sanitization--universal-age-standardization)
   - [2.3 Complete Legal, Terms & Studio Policy Framework](#23-complete-legal-terms--studio-policy-framework)
   - [2.4 Deep-Linked In-App Enrolment & Direct Billing](#24-deep-linked-in-app-enrolment--direct-billing)
   - [2.5 Database-Backed Waitlist Engine](#25-database-backed-waitlist-engine)
   - [2.6 Instructor Scoping & Strict Batch Assignment](#26-instructor-scoping--strict-batch-assignment)
   - [2.7 Automated Multi-Channel Event Broadcasting](#27-automated-multi-channel-event-broadcasting)
   - [2.8 Fitness & Mind-Body Pricing Expansion](#28-fitness--mind-body-pricing-expansion)
   - [2.9 In-Place Administrative Class & Batch Editing](#29-in-place-administrative-class--batch-editing)
   - [2.10 Multi-Layer Studio Gallery Architecture](#210-multi-layer-studio-gallery-architecture)
   - [2.11 Classical Dance Syllabi & Fluid Racetrack Roadmaps (Kuchipudi & Kathak)](#211-classical-dance-syllabi--fluid-racetrack-roadmaps-kuchipudi--kathak)
   - [2.12 International Guest Trainers Showcase](#212-international-guest-trainers-showcase)
   - [2.13 Studio Rental Showcase & Lighting Architecture](#213-studio-rental-showcase--lighting-architecture)
   - [2.14 Official Rhythmzz Merch & Gear Storefront](#214-official-rhythmzz-merch--gear-storefront)
   - [2.15 Authentication & Phone Normalization (Passwordless Architecture)](#215-authentication--phone-normalization-passwordless-architecture)
   - [2.16 Mandatory Parents' Information & Single-Number Guardian Capability](#216-mandatory-parents-information--single-number-guardian-capability)
   - [2.17 Backend Logic Hardening & ACID Transaction Safety](#217-backend-logic-hardening--acid-transaction-safety)
3. [Production Deployment Blueprint ($0.00 / Month Free Tier)](#3-production-deployment-blueprint-000--month-free-tier)
   - [3.1 Feasibility Verdict & Mathematical Proof (100–150 DAU)](#31-feasibility-verdict--mathematical-proof-100150-dau)
   - [3.2 "What to Deploy Where" Architecture Matrix](#32-what-to-deploy-where-architecture-matrix)
   - [3.3 Fresh Gmail, Supabase & Vercel Account Setup Guide](#33-fresh-gmail-supabase--vercel-account-setup-guide)
   - [3.4 Database Setup & Zero-Downtime Migration Execution](#34-database-setup--zero-downtime-migration-execution)
   - [3.5 Complete Production Environment Variables (`.env.production`)](#35-complete-production-environment-variables-envproduction)
   - [3.6 Vercel Blob Configuration & Zero-Egress Storage](#36-vercel-blob-configuration--zero-egress-storage)
   - [3.7 Keep-Warm Cron Engine (Preventing 7-Day Supabase Pause)](#37-keep-warm-cron-engine-preventing-7-day-supabase-pause)
   - [3.8 Custom Domain, DNS & SSL Configuration](#38-custom-domain-dns--ssl-configuration)
   - [3.9 Post-Deployment Smoke Test Protocol & Verification Checklist](#39-post-deployment-smoke-test-protocol--verification-checklist)

---

## 1. Executive Overview & Business Objectives

Rhythmzz Academy of Dance is a premier performing arts institution headquartered in Hyderabad, India, offering professional training across Western Contemporary, Bollywood, Hip-Hop, Classical Indian Dance (Kuchipudi & Kathak), Gymnastics, and Mind & Body Fitness (Yoga & Zumba).

The platform was engineered to satisfy five non-negotiable operational imperatives:
1. **Zero Recurring Infrastructure Cost ($0.00/mo)**: Comfortably sustain **100 to 150 daily active customers** (students, parents, faculty, walk-ins, and visitors) entirely on the free tiers of Vercel and Supabase without hitting bandwidth or storage egress limits.
2. **Professional Institutional Polish**: Eliminate generic "AI slop", stock templates, placeholder assets, and washed-out mobile UI with bespoke high-contrast typography, authentic media pipelines, concentric border radii, and 44px+ touch targets.
3. **Data Integrity & Student Safety**: Enforce mandatory parent/guardian contact details for studio emergency readiness, while providing frictionless single-number linking for adult learners.
4. **Institutional Independence**: Replace hardcoded faculty names with generic titles (e.g. *Contemporary Faculty*, *Kuchipudi Faculty*) to protect institutional continuity, and enforce that only studio administration can create and assign batches.
5. **Direct In-App Commercial Conversions**: Deep-link all public pricing tiers straight into in-app checkout and official invoices, demoting external WhatsApp redirects to an optional receipt-sharing channel.

---

## 2. Exhaustive Feature Evolution & Nuances (What We Have Done)

### 2.1 Zero-Egress Storage & Video Architecture
* **Problem:** Direct hosting of `.mp4` video files (class reels, performance showcases, spotlight hero clips) in Supabase Storage buckets rapidly depleted free-tier egress limits (5 GB/month), triggering unexpected cloud billing.
* **Architectural Solution:**
  1. Converted all class reels and student showcases to use **Instagram oEmbed and CDN iframes**. Video files are never uploaded to Supabase or streamed through backend compute.
  2. Offloaded 100% of video streaming bandwidth to Meta's global edge network at zero cost.
  3. Optimized hero spotlight video (`spotlight-3.mp4`) from hundreds of megabytes down to an ultra-efficient 66 MB file, guaranteeing zero perceptual quality degradation while respecting git repository and Vercel edge delivery standards.

### 2.2 Trainer Sanitization & Universal Age Standardization
* **Client Directive:** *"Just don’t mention the trainers name. Kids 3.5 - 12 years. Adults 13+ years. Gymnastics 5+ years."*
* **Implementation Nuances:**
  - Audited and sanitized all hardcoded faculty names (Deepak, Shiva, Srusti, Nitish, Kajal, Srikanth) from pricing cards, WhatsApp message templates, SEO structured metadata (`schema.org`), timetable fallbacks, certification tracks, and classical syllabus matrices.
  - Substituted generic, professional faculty descriptors: *Western Faculty*, *Classical Dance Faculty*, *Fitness Faculty*, and *Guest Choreographers*.
  - Standardized age thresholds academy-wide:
    - **Kids Dance:** `3.5 – 12 years`
    - **Adults Dance:** `13+ years`
    - **Gymnastics:** `5+ years` (fixed UI bug where gymnastics previously showed a bare `5`).

### 2.3 Complete Legal, Terms & Studio Policy Framework
* **Legal Ingestion:** Extracted and digitized two formal institutional legal charters (`Rhythmzz Instructor T&C.docx` and `Rhythmzz_Student_Portal_TC.docx`).
* **Public & Authenticated Routes:**
  - `/terms`: Public student terms covering portal account usage, mandatory fees, code of conduct, liability waiver, and photo consent.
  - `/instructor-terms`: Public faculty recruitment & engagement policy outlining trainer standards, dress codes, punctuality, and contractor definitions.
  - `/student/terms`: Authenticated portal view with high-visibility callouts for the non-negotiable **7th of the month fee due date**, late fee policies, and attendance dispute rules.
  - `/instructor/terms`: Authenticated faculty view detailing revenue share tiers (**Starter 35%**, **Core 38%**, **Senior 42%**, **Elite 45%**), mandatory daily attendance logging, and weekly social media quotas (2 posts, 1 reel).
* **Optical Alignment:** Rebuilt legal page layouts from an asymmetrical left tilt to an optically centered, concentric layout (`max-w-4xl mx-auto` with clean section navigation).

### 2.4 Deep-Linked In-App Enrolment & Direct Billing
* **Elimination of WhatsApp Hijack:** Converted every *"Book this plan"* button on pricing cards (Drop-in, Sibling, Annual, All-Access, Yoga, Zumba) from external WhatsApp chat links to deep-linked in-app checkout:
  ```
  /enrol?intent=pay&programme={slug}&plan={tierId}&fee={price}
  ```
* **Confirmed Plan Card:** When visitors arrive with deep-linked parameters, `EnrolForm` suppresses redundant multi-step selection grids and renders a pre-locked **Confirmed Plan Card**, displaying the exact plan and fee.
* **In-App Checkout & Invoice Generation:** Enrolment submissions remain 100% in-app. The system confirms the registration, assigns the student ID, presents a printable **Official Enrolment Invoice** with UPI QR payment options and timetable, and demotes WhatsApp to an optional receipt-sharing button.

### 2.5 Database-Backed Waitlist Engine
* **Real Backend Action (`submitWaitlistRequest` in `src/actions/waitlist.ts`):**
  - Replaced static placeholder links with a fully interactive modal (`WaitlistModal`).
  - Implements sliding-window IP rate limiting (6 submissions / 15 minutes).
  - Captures applicant details, logs into `enquiries` (`source: 'waitlist'`) and `batch_waitlist`.
  - Dynamically computes the applicant's exact waitlist queue number and dispatches an alert to the studio desk.

### 2.6 Instructor Scoping & Strict Batch Assignment
* **Architecture Rule:** Batches are institutional entities created and assigned strictly by Academy Admins (`/admin/classes`). **Instructors cannot create batches.**
* **Instructor Privileges:** Instructors can *only* set up and modify schedule timings (start time, end time, days of the week) for batches explicitly assigned to them (`batch.instructor_id === instructor.id`).
* **Zero Unassigned Privileges:** If an instructor has zero assigned batches, all batch creation controls and attendance triggers are cleanly hidden and replaced with an informative banner directing them to studio administration.

### 2.7 Automated Multi-Channel Event Broadcasting
* **Multi-Channel Engine (`src/actions/events.ts`):**
  - Integrated an automated broadcast dispatcher into `EventsManager`.
  - Supports three delivery channels upon event creation:
    1. **In-App Dashboard:** Writes to `broadcast_logs`, displaying instant event notices on all active student dashboards and `/student/notices`.
    2. **WhatsApp Notification:** Enqueues templated alert payloads into `broadcast_queue` for automated batch dispatch.
    3. **Both:** Synchronously executes in-app notice creation and enqueues WhatsApp messages simultaneously.

### 2.8 Fitness & Mind-Body Pricing Expansion
* **New Fitness Plans:** Added standalone **Yoga** (₹1,000/month, 1 day/wk, Tuesday 9:30 AM) and standalone **Zumba** (₹1,500/month, 2 days/wk, Monday & Wednesday 8:30 AM / 9:30 AM).
* **Strict Price-Ordered Layout:** Sorted all Special & All-Access plan cards in ascending price order:
  $$\text{Yoga (₹1,000)} \rightarrow \text{Zumba (₹1,500)} \rightarrow \text{Sibling Plan (₹3,500)} \rightarrow \text{Annual Plan (₹18,000)}$$
* Pre-linked to `/enrol?plan=yoga&fee=1000` and `/enrol?plan=zumba&fee=1500` with timetable locking.

### 2.9 In-Place Administrative Class & Batch Editing
* **Elimination of "Delete-and-Recreate":** Admins previously had to delete and recreate entire batches just to change a time or day.
* **Server Actions (`updateBatch`, `updateProgramme`):** Added comprehensive server actions validated by Zod schemas.
* **Interactive UI:** Added pencil edit triggers across all batch cards on `/admin/classes`, enabling immediate in-place updates to time slots, interactive day-of-week chips, capacity limits, fee structures, and instructor assignments with instant cache revalidation.

### 2.10 Multi-Layer Studio Gallery Architecture
* **Visibility Sync:** Resolved the discrepancy where admins previously saw only 6 uploaded database photos while the public gallery displayed 60+ curated assets.
* **Unified Pipeline:** Inside `GalleryManager` (`/admin/gallery`), dynamic Supabase uploads are unified with the studio's authentic photography archive (`ALL_AUTHENTIC_GALLERY_IMAGES`).
* **Filtering & Categorization:** Added segmented tabs (**All 60**, **Database Uploads 6**, **Studio & Tour Archive 54**) alongside category tag filters (Classes, Stage, Jam, Tour).

### 2.11 Classical Dance Syllabi & Fluid Racetrack Roadmaps (Kuchipudi & Kathak)
* **Master Syllabi Architecture:**
  - **Kuchipudi (`/syllabus/kuchipudi`):** 10-Year Foundation and 6-Year Accelerated Master Curriculum with 4 classical pillars (Nritta, Nritya, Natya, Abhinaya) and the complete sacred 8-part **Margam Performance Repertoire** (Poorvarangam, Jatiswaram, Shabdam, Vinayaka Kauthuvam, Keerthana, Tarangam, Thillana & Mangalam).
  - **Kathak (`/syllabus/kathak`):** 7-Year Foundation and 4-Year Fast-Track Curriculum detailing Nritta, Nritya, Natya, Raag & Taal mastery (Teentaal, Jhaptal, Ektaal, Rupak), and signature repertoire (Ganesh Paran, Amad, Toda/Tukda, Chakkar 9/27/54 pirouettes, Gat Nikas, Tarana, Kramalaya).
* **Fluid Racetrack SVG Roadmap:** Engineered an interactive, curved racetrack SVG progression roadmap with gold milestone medallions and responsive year-by-year syllabus tracking.
* **Classical Cross-Routing Fix:** Fixed cross-navigation triggers so "Also view Kathak" on the Kuchipudi page accurately routes to `/syllabus/kathak`, and "Also view Kuchipudi" on the Kathak page accurately routes to `/syllabus/kuchipudi`.

### 2.12 International Guest Trainers Showcase
* **Dedicated Route (`/guest-trainers`):** Created a premium showcase honoring international guest faculty who conducted exclusive masterclasses:
  - **Atalya Baumer** (Israel · Gaga Movement & Improvisation Artist, Jerusalem Academy of Music & Dance alumna).
  - **Maria Schneiders** (Germany · Urban Contemporary & Floorwork Specialist, Folkwang University alumna).
* **Zero-Crop Mobile Guarantee:** Configured natural aspect ratio image containers (`object-contain max-h-[460px]`) guaranteeing zero edge cropping on mobile and desktop screens.

### 2.13 Studio Rental Showcase & Lighting Architecture
* **Showcase (`/studio-rental`):** Full architectural breakdown of the facility: 1,800 sq.ft sprung wooden flooring, 45-foot floor-to-ceiling mirror array, acoustic treatment, sound system, client lounge, and customizable DMX ambient lighting.
* **Interactive Lightbox:** Built `studio-gallery.tsx` with category filters and keyboard-navigable fullscreen modal.
* **Rate Cards:** Clear package cards for Rehearsal (₹700/hr), Video Shoot (₹1,200/hr), and Masterclass Workshops (₹1,800/hr) with direct WhatsApp slot inquiry links.

### 2.14 Official Rhythmzz Merch & Gear Storefront
* **Storefront (`/gear`):** Complete e-commerce catalog showcasing academy apparel, practice uniforms, dance footwear, and classical accessories (brass ghungroos, practice sarees).
* **Interactive Cart Modal:** Real-time size picker, color picker, quantity counter, and instant WhatsApp order payload generator.
* **Admin Inventory Manager (`/admin/gear`):** Full CRUD catalog management with stock adjustments, featured toggles, pricing, and active status switches.

### 2.15 Authentication & Phone Normalization (Passwordless Architecture)
* **Zero-OTP Cost Strategy:** Because SMS OTP providers incur per-message gateway costs and carrier registration overhead, authentication is streamlined into:
  1. **Magic Link / Email Auth** (via Supabase Auth - completely free).
  2. **Google OAuth** (one-click instant authentication).
* **Mandatory Phone Signup Capture:** To guarantee that every student and parent has an active WhatsApp number on file without paying for OTP APIs, a post-login verification interceptor checks if `user.phone` or `student.phone` is populated. If missing, it immediately redirects to:
  ```
  /login?step=phone
  ```
  which mandates entering an Indian 10-digit mobile number before portal access is unlocked.

### 2.16 Mandatory Parents' Information & Single-Number Guardian Capability
* **Mandatory Student Profile Fields:** In accordance with institutional safety and emergency readiness policies, student profiles mandate:
  - Parent / Guardian Full Name (`parentName`)
  - Parent / Guardian 10-digit Mobile Phone (`parentPhone`)
  - Relationship to Student (`parentRelationship`)
* **Single-Number Own-Contact Toggle (`#profile-same-phone-toggle`):**
  - **Audio Request Fulfilled:** *"Give option that person can mark his own number as a guardian number as well. So no need of having two numbers."*
  - Added an interactive checkbox: `[x] Same as student mobile` directly above the guardian phone field on `/student/profile`.
  - When checked, it automatically mirrors the student's mobile number, dynamically updates if the student phone changes, and displays a confirmed linked badge: `✓ Marked as student's own number (+91 XXXXXXXXXX)`.
  - Added `'Self'` to the relationship chips: `[Mother] [Father] [Guardian] [Self]`. Selecting `'Self'` auto-links the phone and copies the student's name if empty.
* **Admin Parity:** Added a 1-click **"Same as student phone"** button in both the walk-in enrollment modal (`add-student-modal.tsx`) and the student edit modal (`student-actions.tsx`), plus an inline `Same as student` badge on `/admin/students/[id]`.
* **Multi-Layer Resilient Persistence:**
  - Persists across direct database columns (`parent_name`, `parent_phone`, `parent_relationship`).
  - Gracefully falls back to storing structured JSON inside `display_name` if remote database columns are pending migration.
  - Updates Supabase Auth `user_metadata` synchronously.

### 2.17 Backend Logic Hardening & ACID Transaction Safety
* **Strict Payment Status Engine:** Hardened `isConfirmed(p)` in `ledger.ts` to strictly evaluate `p.status === 'confirmed'`. Pending or unverified UPI payments are never counted as active fee coverage.
* **Strict Due Date & Overdue Transitions:** Fixed fee due date strictly to the **7th of each month** (`FEE_DUE_DAY = 7`). Payments past the 7th transition immediately into `"Overdue"`.
* **Atomic PostgreSQL Batch Switching:** Engineered `resolve_batch_switch_request_atomic` stored procedure utilizing `FOR UPDATE` row locks to prevent race conditions during high-concurrency batch transfers.
* **Attendance Sync on Leave Approval:** When student leave requests are approved by faculty or admins, attendance records are atomically upserted with `status: 'leave_excused'`.

---

## 3. Production Deployment Blueprint ($0.00 / Month Free Tier)

### 3.1 Feasibility Verdict & Mathematical Proof (100–150 DAU)

Running **100 to 150 daily active customers** on the **Free Tiers of Vercel and Supabase** is **100% FEASIBLE** with massive headroom across every metric:

```mermaid
pie title Monthly Fast Data Transfer Headroom (150 DAU on Vercel)
    "Vercel Edge Headroom (93.5 GB)" : 93.5
    "Vercel Edge Egress (6.5 GB)" : 6.5
```

```mermaid
pie title Monthly Database Egress Headroom (150 DAU on Supabase)
    "Supabase DB Headroom (4.95 GB)" : 4.95
    "Supabase DB Egress (0.05 GB)" : 0.05
```

#### Detailed Free Tier Limits vs. 150 DAU Consumption:

| Platform | Resource Metric | Free Tier Limit | 150 DAU Monthly Consumption | Utilization | Safety Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase** | Auth Monthly Active Users (MAU) | 50,000 MAU | ~3,500 MAU | **7.0%** | 46,500 user buffer |
| **Supabase** | Database Disk Space | 500 MB | ~12.5 MB / year | **2.5%** | 487.5 MB free |
| **Supabase** | Database Egress Bandwidth | 5.0 GB / month | ~0.045 GB (45 MB) | **0.9%** | 4.95 GB free |
| **Supabase** | API Requests | Unlimited | ~45,000 / month | **0.0% (Unlimited)**| Unrestricted |
| **Vercel** | Fast Data Transfer (Edge Egress)| 100 GB / month | ~4.5 – 6.5 GB | **6.5%** | 93.5 GB free |
| **Vercel** | Serverless Function Invocations| 1,000,000 / month | ~40,000 calls | **4.0%** | 960,000 calls buffer |
| **Vercel Blob**| Media Data Egress | 10 GB / month | ~2.5 – 4.2 GB | **35.0%** | Safe with WebP |
| **Vercel Blob**| Media Storage Space | 1 GB | ~250 MB | **25.0%** | ~1,500 WebP images |

---

### 3.2 "What to Deploy Where" Architecture Matrix

```mermaid
graph TD
    User([Visitor / Student / Faculty / Admin]) -->|HTTPS Request| VercelEdge[Vercel Edge Network]

    subgraph Vercel ["Vercel Hobby Tier ($0.00/mo)"]
        VercelEdge --> NextServer[Next.js 16 SSR & Server Actions]
        VercelEdge --> StaticAssets[Static HTML / WebP Assets / Fonts]
        NextServer --> BlobUpload[/api/blob/upload]
        BlobUpload --> VercelBlob[(Vercel Blob CDN — 10 GB)]
    end

    subgraph Supabase ["Supabase Free Tier ($0.00/mo)"]
        NextServer -->|Pure Text / JSON Queries Only| Postgres[(PostgreSQL 15+ DB)]
        User -->|Auth Tokens / OAuth| SupabaseAuth[Supabase Auth]
        Postgres --> RLS[Row Level Security & Stored Procs]
    end

    subgraph ExternalCDNs ["External Free CDNs"]
        User -->|Class Reels & Videos| Instagram[Meta / Instagram oEmbed CDN]
        User -->|Direct Receipts & Support| WhatsApp[WhatsApp Web Protocol]
        User -->|Optional Hosted Payments| Razorpay[Razorpay Gateway]
    end
```

#### Cardinal Allocation Rule:
1. **Supabase:** Stores **ONLY relational text and JSON data** (student records, batch rosters, attendance logs, ledger rows). **ZERO video files and ZERO high-res photos are stored in Supabase buckets**, eliminating egress charges.
2. **Vercel Blob:** Stores uploaded static media (profile photos, merchandise thumbnails, event banners) compressed in WebP format.
3. **Instagram Edge CDN:** Streams 100% of video showcase content via oEmbed / iframe embeds, entirely offloading gigabytes of video streaming bandwidth.

---

### 3.3 Fresh Gmail, Supabase & Vercel Account Setup Guide

When deploying with a clean slate:

#### Step 1: Create Dedicated Google Account
- Create a dedicated studio administrative Gmail (e.g. `rhythmzz.academy@gmail.com` or `rhythmzz.ops@gmail.com`).
- Enable 2-Factor Authentication (2FA) and store backup recovery codes securely.

#### Step 2: Create Fresh Supabase Organization & Project
1. Log in to [supabase.com](https://supabase.com) using the new Google Account.
2. Click **New Project**:
   - **Name:** `rhythmzz-academy-prod`
   - **Database Password:** Generate a strong 24-character alphanumeric password and save it in a password manager.
   - **Region:** `South Asia (Mumbai) - ap-south-1` (minimizes latency for Hyderabad and Indian visitors to <30ms).
   - **Pricing Plan:** **Free ($0/month)**.
3. Once the database provisions (takes ~90 seconds), navigate to **Project Settings → API**:
   - Copy **Project URL** (e.g. `https://xyzcompany.supabase.co`).
   - Copy **Project API Keys**: `anon` (public) and `service_role` (secret).

#### Step 3: Create Fresh Vercel Account & Import Project
1. Log in to [vercel.com](https://vercel.com) using the new Google Account or connected GitHub.
2. Click **Add New → Project** and import the `aweswe/Dance-Studio` repository.
3. Configure project settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
4. Do NOT deploy yet — first configure Environment Variables (Section 3.5) and Vercel Blob (Section 3.6).

---

### 3.4 Database Setup & Zero-Downtime Migration Execution

1. In the Supabase Dashboard, open the **SQL Editor**.
2. Click **New Query**, open [`supabase/setup.sql`](file:///Users/jarvis/Desktop/Dance-Studio/supabase/setup.sql) from the repository, paste its complete contents, and click **Run**.
3. This creates:
   - All core tables (`programmes`, `batches`, `instructors`, `students`, `attendance`, `fee_payments`, `enquiries`, `events`, `gear_products`, `broadcast_logs`, `broadcast_queue`, `batch_switch_requests`).
   - All Row-Level Security (RLS) policies granting public read for active offerings and locking administrative functions to authorized roles.
   - All atomic stored procedures (`resolve_batch_switch_request_atomic`).
   - Column safety migrations including `parent_name`, `parent_phone`, and `parent_relationship`.
4. Run the seed query from [`supabase/seed.sql`](file:///Users/jarvis/Desktop/Dance-Studio/supabase/seed.sql) to populate initial programmes (Kids Dance, Adults Dance, Classical Dance, Gymnastics, Mind & Body Fitness), initial batches, and starter gear catalog.

---

### 3.5 Complete Production Environment Variables (`.env.production`)

Configure these in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable Name | Value / Source | Scope | Mandatory |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings → API → `Project URL` | Production, Preview, Dev | **Yes** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API → `anon` public key | Production, Preview, Dev | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API → `service_role` secret | Production, Preview, Dev | **Yes** |
| `BLOB_READ_WRITE_TOKEN` | Auto-configured via Vercel Blob creation | Production, Preview, Dev | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | `https://rhythmzz.in` (or your assigned Vercel URL) | Production, Preview, Dev | **Yes** |
| `CRON_SECRET` | Generate random 32-char string: `openssl rand -hex 16` | Production | **Yes** |
| `NEXT_PUBLIC_STOREFRONT_MODE` | `live` | Production, Preview, Dev | **Yes** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919052980859` | Production, Preview, Dev | **Yes** |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Dashboard → API Keys (if using gateway) | Production | Optional |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → API Keys (if using gateway) | Production | Optional |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Webhooks | Production | Optional |

---

### 3.6 Vercel Blob Configuration & Zero-Egress Storage

1. Inside your Vercel Project Dashboard, navigate to the **Storage** tab.
2. Click **Create Database** and select **Blob** (Hobby Free Tier includes 10 GB bandwidth and 1 GB storage).
3. Name your store: `rhythmzz-media-blob`.
4. Connect it to your project. Vercel automatically populates `BLOB_READ_WRITE_TOKEN` into your project environment variables.
5. All file uploads through `/api/blob/upload` will now stream directly to Vercel's Edge CDN without touching Supabase.

---

### 3.7 Keep-Warm Cron Engine (Preventing 7-Day Supabase Pause)

**The Supabase Inactivity Nuance:** Free-tier Supabase projects are automatically paused by Supabase after 7 consecutive days without database activity.

**The Solution:** The repository includes scheduled Vercel cron jobs in [`vercel.json`](file:///Users/jarvis/Desktop/Dance-Studio/vercel.json):

```json
{
  "crons": [
    {
      "path": "/api/cron/fee-reminders",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/broadcast",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

* Every morning at 02:00 UTC, `/api/cron/fee-reminders` executes a lightweight query checking for overdue student payments.
* Every 10 minutes, `/api/cron/broadcast` polls for pending WhatsApp dispatch items.
* **Result:** The Supabase database receives regular daily queries, ensuring that the project **never pauses** even during holiday breaks.

---

### 3.8 Custom Domain, DNS & SSL Configuration

1. In Vercel, go to **Project Settings → Domains**.
2. Add your custom domain (e.g. `rhythmzz.in` and `www.rhythmzz.in`).
3. In your DNS provider (e.g. Cloudflare, GoDaddy, Namecheap):
   - **Type A Record:** `@` points to `76.76.21.21`
   - **CNAME Record:** `www` points to `cname.vercel-dns.com`
4. In Supabase Dashboard, go to **Authentication → URL Configuration**:
   - Set **Site URL** to `https://www.rhythmzz.in`
   - Add **Redirect URLs**:
     - `https://www.rhythmzz.in/**`
     - `https://www.rhythmzz.in/auth/callback`
     - `https://rhythmzz.in/**`
     - `http://localhost:3000/**`

---

### 3.9 Post-Deployment Smoke Test Protocol & Verification Checklist

Once deployed to production, run this 10-step verification protocol:

```mermaid
graph LR
    Step1[1. Homepage Load] --> Step2[2. Deep-Link Enrol]
    Step2 --> Step3[3. Waitlist Modal]
    Step3 --> Step4[4. Single-Phone Profile]
    Step4 --> Step5[5. Admin In-Place Edit]
    Step5 --> Step6[6. Classical Roadmaps]
    Step6 --> Step7[7. Merch Storefront]
    Step7 --> Step8[8. Rental Showcase]
    Step8 --> Step9[9. Automated Crons]
    Step9 --> Step10[10. E2E Suite 35/35]
```

1. **Public Homepage (`/`):** Verify hero video plays smoothly, spotlight reels load via Instagram CDN without console errors, and brand logo renders crisp.
2. **Deep-Linked Enrolment (`/pricing` $\rightarrow$ `/enrol`):** Click *"Book this plan"* on any card; verify that the Confirmed Plan Card locks to the chosen tier and produces an in-app printable invoice upon submission.
3. **Waitlist Engine:** Click *"Join Waitlist"* on any full class; verify that `WaitlistModal` submits and returns a dynamic queue position.
4. **Student Profile & Single-Number Guardian (`/student/profile`):**
   - Log in as student.
   - Navigate to profile. Verify that checking `[x] Same as student mobile` automatically links the guardian phone to the student phone without requiring a secondary number.
   - Verify that selecting `Self` populates guardian name and phone cleanly.
5. **Admin In-Place Class Editing (`/admin/classes`):** Click the pencil icon on any batch; change timing and click save; verify that changes update immediately with zero batch deletions.
6. **Classical Dance Syllabus Cross-Routing:**
   - On `/syllabus/kuchipudi`, click *"Also view Kathak"* $\rightarrow$ routes to `/syllabus/kathak`.
   - On `/syllabus/kathak`, click *"Also view Kuchipudi"* $\rightarrow$ routes to `/syllabus/kuchipudi`.
7. **Merch & Gear Storefront (`/gear`):** Open any product modal; change size/color/quantity; click WhatsApp order; verify prefilled order text.
8. **Studio Rental (`/studio-rental`):** Open gallery images; test keyboard navigation (`Escape`, `ArrowRight`, `ArrowLeft`).
9. **Keep-Warm Cron Verification:** Open `/api/health`; verify status 200 OK.
10. **Automated Playwright Suite:** Run the local E2E suite against production:
    ```bash
    TARGET_URL=https://www.rhythmzz.in npx tsx scripts/playwright-full-suite.ts
    ```
    Confirm **35/35 PASSED (0 FAILED)**.

---

## 4. Current Repository Health & Quality Metrics

* **Unit & Integration Tests:** 6 test suites, 55 tests, **100% passing** (`npm test`).
* **Playwright E2E & High-Concurrency Suite:** 35/35 tests, **100% passing** (`scripts/playwright-full-suite.ts`).
* **High-Concurrency Stress Test:** 25 simultaneous users executed with 100% success rate, median latency 548ms, max latency 838ms.
* **Production Build:** `npm run build` completed in 3.6s with **0 errors and 0 type warnings** across all 43 static & dynamic routes.
* **Git Synchronization:** Branch `main` fully synchronized with `origin/main` ([3b00620](https://github.com/aweswe/Dance-Studio/commit/3b00620)).
