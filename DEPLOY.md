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

- Canonical migrations live in `supabase/migrations/0001…0009` (what `supabase db push` applies to a fresh project).
- `supabase/config.toml` is already linked to the production project id.
- Apply only **idempotent** statements to live (`DROP … IF EXISTS` / `ON CONFLICT` / guards).
- `supabase db query -f` cannot run multi-statement files — always use `scripts/apply-migration.js`.

**Admin user** (one-time): Authentication → Add user (Email + Password), then:

```sql
INSERT INTO public.users (id, role) VALUES ('<paste-auth-uid>', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## 2. Vercel

1. Import the repo, framework preset Next.js (auto-detected), root directory default.
2. Add **Environment Variables** (Production — and Preview if wanted):

   | Variable | Required | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL, `https://…supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Publishable anon key (safe for browser) |
   | `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-only; never prefix with `NEXT_PUBLIC_` |
   | `NEXT_PUBLIC_SITE_URL` | optional | Defaults to `https://rhythmzz.in` in code |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Phase 3 | Enables payments + "Pay now" everywhere |
   | `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Phase 3 | Server-side order creation |
   | `RAZORPAY_WEBHOOK_SECRET` | Phase 3 | Webhook signature verification |
   | `WHATSAPP_API_URL` / `WHATSAPP_API_KEY` / `WHATSAPP_PROVIDER` | Phase 7 | WATI/Interakt; absent → mock mode |
   | `CRON_SECRET` | Phase 7 | Guards `/api/cron/*` (Vercel sends `Authorization: Bearer`) |

3. **Crons** are already configured in `vercel.json` (broadcast `*/5 * * * *`, fee reminders `03:30 UTC`). The routes are stubs until Phase 7 — safe to deploy.
4. **Custom domain**: Settings → Domains → add `rhythmzz.in` and `www.rhythmzz.in` (redirect to apex).
   - DNS at the registrar: apex `A 76.76.21.21`, `www CNAME cname.vercel-dns.com` (or use Vercel's nameservers).
   - After DNS resolves: HTTPS cert is issued automatically; enable "Force HTTPS".
5. Deploy and smoke-test: homepage canonicals/OG use `https://rhythmzz.in`, login works, admin works.

## 3. Supabase Auth (dashboard → Authentication → URL Configuration)

| Setting | Value |
|---|---|
| Site URL | `https://rhythmzz.in` |
| Redirect URLs | `https://rhythmzz.in/api/auth/callback`, `https://rhythmzz.in/**` |
| | (dev: `http://localhost:3000/**`) |

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
