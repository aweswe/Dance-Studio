# Rhythmzz Academy of Dance

Full-stack website, student portal, and admin dashboard for Rhythmzz Academy of Dance, Secunderabad. Production runs at **https://rhythmzz.in**.

## Stack

- **Next.js 16 (App Router)** on Vercel — public site, `/student` portal, `/admin` dashboard, cron routes
- **Supabase** (Postgres + Auth + Storage) — project `pndbazmwnbqzkwwmmgaf`, Mumbai region
- **Razorpay** — online fee payments (test mode until keys are verified)
- **WhatsApp** (WATI/Interakt) — broadcasts, fee reminders, rental updates via a queue drained by cron
- Tailwind CSS, Zod, Vitest

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://pndbazmwnbqzkwwmmgaf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Publishable key — safe for the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-only, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | – | Defaults to `https://rhythmzz.in` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | for payments | Enables the Razorpay checkout |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET` | for payments | Server-side orders + webhook verification |
| `WHATSAPP_API_KEY` | for live WhatsApp | Absent → mock mode (messages logged, admin banner shown) |
| `WHATSAPP_PROVIDER` / `WHATSAPP_API_URL` | for live WhatsApp | `interakt` (default) or `wati` |
| `CRON_SECRET` | ✅ | Guards `/api/cron/*` (set on Vercel for the crons to work) |

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build (--webpack)
npm run start   # serve the production build (smoke on :3010)
npm run lint    # ESLint (0 errors; ~160 warnings are tracked debt)
npm test        # Vitest unit tests (validators, rate limit, CSV, ledger)
```

## Database & migrations

Canonical migrations live in `supabase/migrations/0001…0014`. To change the schema:

```bash
node scripts/build-setup-sql.js                                   # 1. regenerate supabase/setup.sql (bootstrap)
node scripts/apply-migration.js supabase/migrations/NNNN_x.sql --db-url "$DB_URL"   # 2. apply to live (idempotent only)
bash scripts/regen-types.sh "$DB_URL"                             # 3. regenerate src/lib/supabase/types.ts
npm run build                                                     # 4. build + live smoke
```

`DB_URL` is the Supabase pooler connection string (see DEPLOY.md). Live migrations must stay idempotent — `DROP … IF EXISTS` before `CREATE`, guarded ALTERs.

## Background jobs (Vercel crons)

| Cron | Schedule | Route | Job |
|---|---|---|---|
| Broadcast drain | every 5 min | `/api/cron/broadcast` | Sends queued WhatsApp messages, 3 attempts each |
| Fee reminders | 03:30 UTC daily | `/api/cron/fee-reminders` | Queues `fee_reminder` for students with an uncovered current month |

Both are authenticated with `Authorization: Bearer $CRON_SECRET` and skip gracefully when `WHATSAPP_API_KEY` is missing.

## Architecture notes

- **Roles** — `public.users.role` drives routing: `admin`, `student`, `instructor`. The proxy (`src/proxy.ts`) guards `/admin` and `/student` prefixes.
- **RLS is the real gate** — server actions additionally check `isAdmin()` for clean errors; the anon/student policies are what enforce access.
- **WhatsApp queue** — `sendBroadcast` enqueues rows in `broadcast_queue`; the cron drain sends with retries. No synchronous send loops.
- **Enquiries** — anon INSERT policy (rate-limited app-side), admin-only read via `get_user_role()`.
- **Kuchipudi progress** — module names come from `src/lib/kuchipudi/curriculum.ts` (single source of truth); admins mark modules on the student detail page.
- **Security** — rate limiting (`src/lib/rate-limit.ts`) on rentals, exports, broadcasts, certificates, enquiries; RPCs are role-checked; the service-role key never reaches the browser.

## Deploying

See [DEPLOY.md](DEPLOY.md) for the full checklist (Vercel env vars, domain/DNS, Supabase auth redirects, Razorpay webhook URL).
