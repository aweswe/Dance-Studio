# Rhythmzz Academy of Dance — Deployment Checklist

Production: **https://rhythmzz.in** · Hosting: **Vercel** · Database: **Supabase** (`pndbazmwnbqzkwwmmgaf`, Mumbai)

---

## 1. Database (Supabase)

The database is already migrated live. Every migration change follows one workflow:

```bash
node scripts/build-setup-sql.js                    # 1. regenerate supabase/setup.sql (bootstrap)
node scripts/apply-migration.js <file.sql> --db-url "$DB_URL"   # 2. apply to live (add --dry-run first)
bash scripts/regen-types.sh "$DB_URL"              # 3. regenerate src/lib/supabase/types.ts
npm run build                                      # 4. build + live smoke on :3010
```

- Canonical migrations live in `supabase/migrations/0001…0016` (what `supabase db push` applies to a fresh project). Never apply `supabase/rhythmzz-supabase-backup/`.
- After pulling this branch, apply `supabase/migrations/0016_admin_attendance.sql` to live so instructors cannot write attendance via RLS (the app already refuses non-admin marking).
- Apply `supabase/migrations/0017_homepage_reels.sql` for admin-managed homepage reels (`/admin/reels`) and Supabase-backed rate limits.
- `supabase/config.toml` is already linked to the production project id.
- Apply only **idempotent** statements to live (`DROP … IF EXISTS` / `ON CONFLICT` / guards).
- `supabase db query -f` cannot run multi-statement files — always use `scripts/apply-migration.js`.

**Admin user** (one-time): Authentication → Add user (Email + Password), then:

```sql
INSERT INTO public.users (id, role) VALUES ('<paste-auth-uid>', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## 2. Vercel Deployment Strategy (New Free Account & Size Reduction)

> [!IMPORTANT]
> **Production Launch Policy**: For official production rollout, create and link a **brand new free Vercel account**. This grants a fresh 10 GB deployment storage quota and 100 GB Fast Data Transfer bandwidth, completely unencumbered by historical testing deployments.

### A. Deployment Size Reduction & Bandwidth Protection (Pre-Deployment Checklist)

To prevent hitting Vercel's 10 GB deployment storage limit and 100 GB bandwidth cap:

1. **Strict Media Size Cap**:
   - **`public/` directory must stay below 120 MB** (currently reduced from 341 MB down to **102 MB**).
   - Never commit raw uncompressed `.mp4` video files or camera-raw photos (>2 MB) into the repository.
   - All videos in `public/videos/` must be web-optimized using `ffmpeg` (`-crf 26`, web resolution, and `-movflags +faststart` for instant streaming).
   - High-resolution e-commerce and gallery photos are served via edge CDNs (Unsplash / Supabase Storage / Vercel Blob) rather than git bundle storage.

2. **Prevent Deployment Storage Bloat on Vercel**:
   - By default, Vercel creates and preserves a deployment for every commit and preview branch.
   - In project settings (**Settings → Git**), restrict Preview Deployments to only pull requests, or disable preview deployments for draft branches.
   - Periodically prune stale preview deployments using the Vercel CLI:
     ```bash
     # Safely deletes old preview deployments without touching the production domain
     npx vercel rm <project-name> --safe --yes
     ```

### B. Deploying to the New Free Vercel Account (Step-by-Step)

1. **Sign Up / Switch Account**:
   - Create a fresh Vercel Hobby account (e.g. using the studio administrative email or GitHub org).
2. **Import Repository**:
   - In the new Vercel account, click **Add New... → Project**.
   - Import `aweswe/Dance-Studio`.
   - Framework Preset: **Next.js** (auto-detected).
   - Root Directory: `./` (default).
3. **Add Environment Variables**:

   | Variable | Required | Description |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://pndbazmwnbqzkwwmmgaf.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase secret service role key (server only) |
   | `DATABASE_URL` | ✅ | Supabase transaction pooler connection string |
   | `NEXT_PUBLIC_SITE_URL` | ✅ | `https://rhythmzz.in` (or production domain) |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Phase 3 | Razorpay Key ID |
   | `RAZORPAY_KEY_ID` | Phase 3 | Razorpay Secret Key ID |
   | `RAZORPAY_KEY_SECRET` | Phase 3 | Razorpay Secret |
   | `RAZORPAY_WEBHOOK_SECRET` | Phase 3 | Razorpay Webhook Secret |
   | `CRON_SECRET` | ✅ | Secret token protecting cron endpoints (`/api/cron/*`) |
   | `BLOB_READ_WRITE_TOKEN` | Optional | Generated under Vercel Storage → Blob for admin uploads |

4. **Background Crons**:
   - GitHub Actions (`.github/workflows/cron.yml`) triggers background jobs. Add `CRON_SECRET` in **GitHub Repo → Settings → Secrets and variables → Actions**.
5. **Custom Domain**:
   - In Vercel Project **Settings → Domains**, add `rhythmzz.in` and `www.rhythmzz.in`.
   - DNS at registrar: Apex `A 76.76.21.21`, Subdomain `CNAME cname.vercel-dns.com`.
   - Enable "Force HTTPS" once SSL certificates issue.

## 3. Supabase Auth (dashboard → Authentication → URL Configuration)

| Setting | Value |
|---|---|
| Site URL | `https://rhythmzz.in` |
| Redirect URLs | `https://rhythmzz.in/api/auth/callback` |
| | `https://rhythmzz.in/**` |
| | `http://localhost:3000/api/auth/callback` |
| | `http://localhost:3000/**` |
| | `http://127.0.0.1:3000/api/auth/callback` |

Phone OTP sign-in is the primary login path — keep the SMS provider configured in Auth → Providers.

## 4. Storage CORS (dashboard → Storage)

`gallery` bucket → add CORS origin `https://rhythmzz.in` (and `http://localhost:3000` for dev). Uploads are admin-only (RLS); public reads are open.

## 5. Razorpay (Phase 3 — test mode first)

1. Dashboard → Settings → **Webhooks** → URL `https://rhythmzz.in/api/razorpay/webhook`, events `payment.captured` (and `order.paid`), copy the secret into `RAZORPAY_WEBHOOK_SECRET`.
2. Use **Test Mode** keys until a ₹1 end-to-end order → checkout → webhook → fee ledger passes.
3. Payments are enabled purely by the presence of `NEXT_PUBLIC_RAZORPAY_KEY_ID` — the enrol button flips to "Confirm Booking" and student "Pay" buttons hide without it.

## 6. Local development

```bash
cp .env.local.example .env.local   # then fill in Supabase URL/keys
npm install
npm run dev
```

Optional full local DB stack (Docker required): `supabase start` boots Postgres/Auth/Storage and applies `supabase/migrations/` — the fastest way to validate a migration chain before touching live.
