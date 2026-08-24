# Rhythmzz Academy — Work Summary

**Branch:** `feat/rework-supabase-backend` · **Date:** 25 Aug 2026

What changed since the initial commit, in three parts: the design rework, the verification pass, and the Supabase backend setup.

---

## Part 1 — Design & UX rework (reference fidelity)

The site now matches the design reference in `docs/ui-reference/homepage-reference.html`, with authentic copy (no AI slog), motion, and loading states everywhere.

### Chrome & routing
- `(public)/layout.tsx` is now the sole owner of Nav / Footer / WhatsApp float / announcement banner — the double-render bug is gone. Homepage moved to `src/app/(public)/page.tsx`.
- New **/programmes** listing page (2-col grid + JSON-LD ItemList + "not sure?" CTA to /enrol).
- Canonical URLs on every public page; keywords + theme-color in root layout; skip-to-content link; `aria-expanded`/`aria-controls` on menu + FAQ, `aria-pressed` on schedule pills, `aria-hidden` marquee duplicates.

### Copy (all grounded in facts)
- Hero: `NEREDMET X ROAD · SECUNDERABAD · TEACHING SINCE 2010`, tagline `15+ YEARS · 5,000+ STUDENTS · FREE TRIAL CLASS`.
- Section headers: `KIDS · ADULTS · FITNESS · CLASSICAL`, `CLASSES AT NEREDMET X ROAD`, `TRAINED, CERTIFIED, ON STAGE`, `5,000+ STUDENTS. HERE ARE THREE.`, `QUESTIONS WE GET AT THE STUDIO`.
- New **JoinCTA** (`src/components/public/join-cta.tsx`): "YOUR FIRST CLASS IS ON US" + 3 perk cards (₹0 registration fee / free trial / ₹2,000 fees from) + Book Your Free Trial → /enrol.
- Footer: `FEEL THE BEAT!`, live year, tel/mailto links, Razorpay line only when a key is configured.
- Enrol page: `BOOK YOUR FIRST CLASS`, grounded "What's Included", "Need Help?" card (reply within 2 hours).
- Fees locked to the reference: Kids ₹2000/mo · ₹5000/qtr; Adults ₹2500/₹6500; Fitness ₹2500/₹6500; Kuchipudi ₹2000/₹5000. Ages 5+ / 16+.

### SEO & structured data
- `src/components/shared/structured-data.tsx` is now a full async port of the reference: **DanceSchool** (address, geo, hours, founder, 3 awards, areaServed), **OfferCatalog** (4 offers with reference fees + batch windows, derived from the data layer), **FAQPage** (7 Q&As), **BreadcrumbList**.
- Extracted reference blocks kept at `docs/ui-reference/_jsonld-blocks.json`.

### Loading & error states
- Skeleton kit extended (`src/components/ui/skeleton.tsx`): pulse/shimmer variants + Spinner + HeroBlock/StatStrip/Card/ListRow/Table skeletons, sized to real components to avoid CLS.
- `loading.tsx` on 6 surfaces: (public), programmes/[slug], blog/[slug], admin, instructor, student. All admin `Suspense fallback="Loading…"` text replaced with real skeletons.
- `error.tsx` on 4 surfaces + `(public)/not-found.tsx` ("This page isn't on the floor"). All styled to the brand.
- Shimmer/pulse/spin/marquee disabled under `prefers-reduced-motion`.

### Motion (GSAP, gsap.com-style)
- New `src/components/motion/`: gsap-provider (registers ScrollTrigger once, public layout only), `Reveal` (ScrollTrigger.batch staggers), `Parallax` (hero orbs), `CountUp` (stats).
- Mounted tastefully: reveals on section headers + grid staggers, parallax on hero orbs, count-up on stats. Zero animation on the LCP elements (hero logo + H1 render instantly). Dashboards stay GSAP-free.

### Enrol & payments
- Enrol form step 3 → `POST /api/razorpay/create-order` → lazy-loads Razorpay checkout → `POST /api/razorpay/verify` → success screen ("Check WhatsApp for your student login link").
- `src/lib/payments/fulfill-order.ts`: idempotent student provisioning called from **both** the webhook and the verify route (closes the webhook-not-configured gap).
- **Degraded mode** (no `NEXT_PUBLIC_RAZORPAY_KEY_ID`): "Confirm & Pay" becomes a WhatsApp booking CTA prefilled with name/phone/programme/batch.

### Assets
- `public/`: logo.png (from reference base64), icon-192/512, favicon.ico, og-image.jpg (1200×630 brand card) — generated via System.Drawing script.

---

## Part 2 — Verification (Phase 6 results)

All server-side checks passed on a production build (`npm run build`, port 3010):

- ✅ Build clean; homepage + programmes static (○), /enrol and dashboards dynamic (ƒ), 4 programme slugs SSG'd.
- ✅ 17-route URL checklist: all 200/307 as expected; soft-404 carries noindex.
- ✅ Content markers: 3 real JSON-LD blocks, join CTA, FEEL THE BEAT, marquee (12 styles), adults preselect on `/enrol?programme=adults-dance`, grounded notes everywhere.
- ✅ Chrome rendered exactly once (nav/footer/skip-link counts verified).
- ✅ Streaming verified: skeletons flush first on dynamic routes, content swaps in via `$RC`.
- ✅ Error boundary verified end-to-end (server log + digest + flight payload). Next 16.3 behavior documented: `error.tsx` is client-rendered only; the not-found UI streams as the interim shell for the errored slot, then the `E{digest}` row swaps in the error UI on hydration.
- ⚠️ **Browser-only checks remaining** (can't be curl-verified): GSAP runtime feel, Lighthouse LCP/CLS, reduced-motion emulation, and the hydration swap of the error UI.

---

## Part 3 — Supabase backend setup

### What's ready
- **`supabase/setup.sql`** — one combined script to run in the Supabase SQL Editor:
  - Schema (14 tables), indexes, RLS policies, analytics functions — from the backup migrations in `supabase/rhythmzz-supabase-backup/`.
  - **Corrected seed**: reference fees/ages/slugs (incl. `kuchipudi` — the backup had `kuchipudi-classical`, which would have 404'd the programme page), 6 instructors, 6 reference batch windows, the 7 reference FAQs, 3 testimonials, stats. Programme/batch UUIDs mirror the app's built-in defaults so nothing drifts between connected/disconnected modes.
  - `instructors.role` column added (missing from the backup schema — would have silently broken instructor cards).
  - Realtime publication for `attendance`, `fee_payments`, `studio_rentals`.
  - Commented admin-user template.
- **`scripts/build-setup-sql.js`** — regenerates setup.sql from the backup migrations + reference seed.
- The data layer (`src/data/*`) already prefers live Supabase rows and falls back to built-in defaults, so connecting the DB is drop-in.

### To connect (owner action required)
1. Create a Supabase project (region **Mumbai** recommended) → run `supabase/setup.sql` in the SQL Editor.
2. Put into `.env.local` (gitignored — never commit):
   ```
   NEXT_PUBLIC_SUPABASE_URL=…
   NEXT_PUBLIC_SUPABASE_ANON_KEY=…
   SUPABASE_SERVICE_ROLE_KEY=…
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_…
   RAZORPAY_KEY_ID=…          (same value)
   RAZORPAY_KEY_SECRET=…
   # optional: RAZORPAY_WEBHOOK_SECRET (only needed once deployed, needs a public URL)
   # optional: WHATSAPP_PROVIDER / WHATSAPP_API_KEY / WHATSAPP_API_URL (Interakt/WATI)
   ```
3. Create the admin login (Authentication → Add user → Email + Password), then run the commented `INSERT INTO public.users (id, role)` snippet from setup.sql.
4. Student OTP login is **phone + WhatsApp channel** — needs Twilio configured in Supabase Auth → Providers → Phone (or switch the channel in `src/app/api/auth/otp/send/route.ts` to `sms`/email).

### Pending backend work (next)
- Live-data smoke test once keys land; fix anything that surfaces.
- Realtime subscriptions in dashboards (attendance, fee payments).
- Razorpay end-to-end with `rzp_test_` keys.
- OTP login end-to-end.
- Full regression against the reference with live data.

---

## How to run
```bash
npm install
npm run dev          # dev server (default port)
npm run build        # production build
npm start -- -p 3010 # production server on 3010 (3000/3001 belong to Orbit Microservices)
```
Lint (Next 16.3 removed `next lint`): `npx eslint <paths…>`.
