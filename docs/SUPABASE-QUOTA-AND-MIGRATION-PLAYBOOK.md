# Rhythmzz Academy of Dance — Supabase Quota Audit & Migration Playbook

**Document Status:** Production Operational Blueprint  
**Topic:** Supabase Free Tier Quota Resolution, Video Offloading & Migration Strategy  
**Impacted Service:** Supabase Project (`pndbazmwnbqzkwwmmgaf`, Mumbai) $\rightarrow$ Next.js Web Application  
**Author / Engineering Team:** Rhythmzz Tech & Architecture  
**Date:** October 2026  

---

## Table of Contents
1. [Executive Summary & Root Cause Audit](#1-executive-summary--root-cause-audit)
2. [Why the Free Tier is Sufficient for Dance Studio Operations](#2-why-the-free-tier-is-sufficient-for-dance-studio-operations)
3. [The Exact Root Cause: Video Egress Spike](#3-the-exact-root-cause-video-egress-spike)
4. [Evaluating the Approach: New Project vs In-Place Remediation](#4-evaluating-the-approach-new-project-vs-in-place-remediation)
5. [The Permanent Solution for Video Hosting](#5-the-permanent-solution-for-video-hosting)
6. [Step-by-Step Execution Playbook: Approach A (New Production Project)](#6-step-by-step-execution-playbook-approach-a-new-production-project)
7. [Step-by-Step Execution Playbook: Approach B (In-Place Remediation)](#7-step-by-step-execution-playbook-approach-b-in-place-remediation)
8. [Production Media Architecture & Safeguards](#8-production-media-architecture--safeguards)

---

## 1. Executive Summary & Root Cause Audit

### The Situation
The Supabase dashboard displayed a warning notice:
> **"Organization exceeded its quota in the previous billing cycle · Projects will be restricted from 20 Oct, 2026 if your organization remains over quota. (Cached Egress Exceeded)."**

### Key Findings
1. **The Database is Healthy & Minimal:** Core database tables, authentication, and logic utilize only **0.03 GB out of 0.5 GB (6%)**. The assumption that the free tier is sufficient for studio operations is **100% accurate**.
2. **The Culprit is Public Video Streaming:** The Supabase Storage bucket `reels` contains **6 raw MP4 video files totaling 56.2 MB**.
3. **The Bandwidth Multiplier:** In `src/components/public/reels-strip.tsx`, video elements had `preload="auto"` and `autoPlay`. Every visitor loading the homepage downloaded all 56.2 MB through Supabase's CDN.
4. **The Math:** Just ~90 visitors in a single billing cycle consumed over **5.05 GB of Cached Egress**, breaching the 5 GB free tier limit.

---

## 2. Why the Free Tier is Sufficient for Dance Studio Operations

A dance studio's operational footprint consists of tabular records (students, batches, registrations, attendance, and fee transactions). Supabase's Free Tier limits far exceed the studio's requirements:

| Metric | Free Tier Quota | Rhythmzz Actual Usage | Usage Percentage | Status |
|---|---|---|:---:|:---:|
| **PostgreSQL Database Size** | 500 MB (0.5 GB) | 30 MB (0.03 GB) | **6%** | Healthy (Good for 5+ years) |
| **Monthly Active Users (MAU)**| 50,000 MAU | 3 MAU | **<0.01%**| Healthy |
| **Normal Database Egress** | 5 GB / month | 0.15 GB / month | **3%** | Healthy |
| **Log Ingestion** | 1 GB / month | 0.009 GB / month | **<1%** | Healthy |
| **Realtime Connections** | 200 concurrent | 1 peak connection | **<1%** | Healthy |
| **Cached Egress (Storage CDN)**| 5 GB / month | **5+ GB (Previous)**<br>**2.22 GB (Current)** | **>100% (Previous)**<br>**44% (Current)** | **BREACHED (VIDEOS)** |

> **Conclusion:** You do not need to upgrade to Supabase Pro ($25/mo or ₹2,100/mo). Supabase is an exceptional database; it simply should not be utilized as a public video streaming CDN on the free plan.

---

## 3. The Exact Root Cause: Video Egress Spike

### Storage File Breakdown (`pndbazmwnbqzkwwmmgaf`)
Direct inspection of the storage buckets shows where bytes originate:

* **Bucket `gallery`:** 7 WebP images $\approx$ **1.1 MB total** (Safe for Free Tier).
* **Bucket `events`:** 4 WebP images $\approx$ **0.6 MB total** (Safe for Free Tier).
* **Bucket `reels`:** 6 full-length MP4 video files:
  1. `seed-r3-1789339680024.mp4`: **18.2 MB**
  2. `r6-bol-mitthi-1789563492348.mp4`: **9.9 MB**
  3. `seed-r4-1789339686146.mp4`: **9.0 MB**
  4. `seed-r2-1789339677551.mp4`: **8.9 MB**
  5. `seed-r6-1789339689857.mp4`: **7.7 MB**
  6. `seed-r5-1789339689049.mp4`: **2.5 MB**
  * **Total Size:** **56.2 MB**

### Code Mechanism in `src/components/public/reels-strip.tsx` (Lines 83–97):
```tsx
<video
  ref={videoRef}
  src={reel.videoSrc}
  muted
  loop
  playsInline
  autoPlay
  preload="auto"   // <-- Forces immediate full download of all 6 video files
  ...
/>
```
Every single visitor who opened the homepage triggered an eager download of 56.2 MB across all 6 cards, exhausting the 5 GB quota after just ~90 sessions.

---

## 4. Evaluating the Approach: New Project vs In-Place Remediation

The user proposed:
> *"We have to create a new Supabase account and then we will go over there and migrate this data as it is. Then we go into production and we will have to solve this Supabase video thing."*

### Is this the right approach?
**Yes, creating a clean production Supabase instance is a sound architectural move, provided that the video files are offloaded simultaneously.**

If data and storage are cloned without moving the videos, the new account will encounter the identical 5 GB cached egress breach within 1–2 weeks.

### Comparison of the Two Viable Approaches:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DECISION MATRIX                                      │
├──────────────────────────┬───────────────────────────┬─────────────────────────────────┤
│ CRITERIA                 │ APPROACH A: NEW ACCOUNT   │ APPROACH B: IN-PLACE FIX        │
├──────────────────────────┼───────────────────────────┼─────────────────────────────────┤
│ Production Cleanliness   │ 100% Clean (Zero notices) │ Clean once reset on 24 Oct      │
│ Risk of Oct 20 Lockout   │ Zero Risk                 │ Low (Current is 2.22 GB / 5 GB) │
│ Setup Time               │ ~20–30 Minutes            │ ~5 Minutes                      │
│ Data Migration Required? │ Yes (Export & Import)     │ No                              │
│ Video Offloading Needed? │ MANDATORY                 │ MANDATORY                       │
│ Cost Impact              │ $0 (Permanent Free Tier)  │ $0 (Permanent Free Tier)        │
└──────────────────────────┴───────────────────────────┴─────────────────────────────────┘
```

---

## 5. The Permanent Solution for Video Hosting

Videos must be decoupled from Supabase Storage. Three zero-cost alternatives exist:

### Option 1: Cloudflare R2 (Recommended for Production)
* **Storage:** 10 GB Free forever.
* **Egress / Bandwidth Fees:** **$0.00 (Zero bandwidth charges, completely unlimited egress)**.
* **Setup:** Create a free Cloudflare bucket, upload the 6 MP4s, enable public access or custom domain (e.g. `media.rhythmzz.in`), and update video URLs.

### Option 2: Vercel Static Hosting (`/public/videos/`)
* **Storage:** Included in Git repository / deployment.
* **Egress / Bandwidth:** Vercel Hobby plan provides **100 GB/month** (20x more bandwidth than Supabase).
* **Setup:** Store the 6 compressed MP4s inside `/public/reels/` and reference local paths `/reels/r1.mp4`.

### Option 3: Cloudinary Video CDN (Free Tier)
* **Bandwidth:** 25 GB/month free.
* **Benefit:** Automatically transcodes video into adaptive bitrates and mobile WebM formats, reducing file size by 70%.

### Mandatory Frontend Code Optimization
Regardless of hosting platform, update `src/components/public/reels-strip.tsx`:
1. Change `preload="auto"` $\rightarrow$ `preload="none"`.
2. Add a static lightweight `poster` image (~40 KB WebP).
3. Only trigger `.load()` and `.play()` when the card intersects the viewport or is explicitly tapped/hovered.

---

## 6. Step-by-Step Execution Playbook: Approach A (New Production Project)

When ready to perform the migration, follow this sequence:

### Phase 1: Create New Supabase Project
1. Log in to [supabase.com](https://supabase.com) using the official studio production account.
2. Create project: `rhythmzz-production` (Region: `ap-south-1` Mumbai).
3. Copy new project URL, Anon Key, Service Role Key, and Database connection string.

### Phase 2: Schema & Data Migration
1. Apply the complete schema from repository:
   - Run `supabase/setup.sql` in the new Supabase SQL Editor.
2. Export table data from current project (`pndbazmwnbqzkwwmmgaf`):
   - Tables: `programmes`, `batches`, `students`, `fee_payments`, `rental_requests`, `events`, `gallery_items`, `syllabus_modules`, `homepage_reels`.
   - Import CSV / SQL dumps into the new database.
3. Migrate Auth Users (if any production user logins exist).

### Phase 3: Offload Video Files (Do NOT upload MP4s to new Supabase)
1. Upload the 6 MP4 files to Cloudflare R2 or commit them to Next.js `/public/reels/`.
2. In the new database, populate `homepage_reels` with the external CDN URLs:
   ```sql
   UPDATE homepage_reels SET video_url = 'https://media.rhythmzz.in/reels/seed-r2.mp4' WHERE id = '...';
   ```
3. Only migrate image buckets (`gallery` and `events`) to the new Supabase storage.

### Phase 4: Code & Environment Cutover
1. Update `.env.local` and Vercel Production Environment Variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<new-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<new-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<new-service-role-key>
   DATABASE_URL=postgresql://postgres.<new-project-ref>:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   ```
2. Deploy to production. Verify that the homepage reels stream from the new zero-egress CDN.

---

## 7. Step-by-Step Execution Playbook: Approach B (In-Place Remediation)

If choosing to keep the current Supabase instance without migration:

1. **Delete MP4 files from Supabase Storage:**
   - Go to Supabase Dashboard $\rightarrow$ Storage $\rightarrow$ `reels` bucket.
   - Delete all 6 video files (`56.2 MB`).
2. **Move videos to Next.js `/public/reels/` or Cloudflare R2:**
   - Update `homepage_reels.video_url` rows in the database to point to the new external URLs.
3. **Update Frontend Preloading:**
   - Set `preload="none"` in `src/components/public/reels-strip.tsx`.
4. **Result:**
   - Cached egress stops completely.
   - Usage freezes at 2.22 GB / 5 GB (well under the limit).
   - On 24 October 2026, the billing cycle resets and the warning banner clears automatically.

---

## 8. Production Media Architecture & Safeguards

To prevent future quota overruns, adhere to the following architecture rules:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       RHYTHMZZ PRODUCTION MEDIA SPLIT                           │
├───────────────────────┬───────────────────────────────┬─────────────────────────┤
│ ASSET TYPE            │ STORAGE DESTINATION           │ MAXIMUM PERMITTED SIZE  │
├───────────────────────┼───────────────────────────────┼─────────────────────────┤
│ Student Documents/PDFs│ Supabase Storage (Private)    │ < 2 MB (PDF)            │
│ Gallery & Event Photos│ Supabase Storage (Public)     │ < 300 KB (WebP format)  │
│ Student Avatar Images │ Supabase Storage (Public)     │ < 150 KB (WebP format)  │
│ Short Video Reels     │ Cloudflare R2 / Vercel CDN    │ < 5 MB (720p H.264)     │
│ Workshop Masterclasses│ YouTube Unlisted / Vimeo      │ Unlimited (Offloaded)   │
└───────────────────────┴───────────────────────────────┴─────────────────────────┘
```

---

**Approved By:** Rhythmzz Academy Technical Architecture  
**Next Step:** Proceed with preferred execution playbook (Approach A or Approach B) when instructed.
