# Rhythmzz Academy of Dance — Scope of Work

> Complete functional specification. This document is the **single source of truth** for all features.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | Next.js 16.3 (App Router) |
| Database, Auth, Storage | Supabase (Free Tier) |
| Payment Gateway | Razorpay |
| WhatsApp Automation | WATI or Interakt |
| Hosting | Vercel |
| CDN | Cloudflare |

> **Key Constraint:** No Supabase Edge Functions. All server-side logic runs via Next.js API Route Handlers to maximize free tier usage.

---

## System Overview

Four surfaces, three roles:

| Surface | Who uses it |
|---|---|
| Public Website | Anyone — marketing, enrolment, payment |
| Student Dashboard | Enrolled students |
| Instructor Dashboard | Instructors — their classes and students only |
| Admin Dashboard | Academy admin — full visibility and control |

---

## How Enrolment Works (Fully Automatic)

1. Student visits website
2. Selects a programme and batch
3. Fills enrolment form — name, phone, email
4. Pays via Razorpay
5. On payment success (automatic):
   - Supabase student record created
   - Assigned to selected batch
   - Student appears in admin dashboard
   - Student appears in instructor's dashboard (their batch only)
   - WhatsApp welcome message sent to student with OTP login link
   - Student logs into their dashboard

> **No manual admin step to create a student. Payment triggers everything.**

---

## Public Website Pages

| Route | Purpose |
|---|---|
| `/` | Home — all marketing sections |
| `/programmes/[slug]` | Individual programme page — details, schedule, instructor, enrol CTA |
| `/enrol` | Enrolment page — programme and batch selection, form, Razorpay checkout |
| `/studio-rental` | Rental info, pricing, booking form |
| `/gallery` | Full photo and video library |
| `/about` | Academy story, instructor profiles, awards |
| `/blog` | Blog listing |
| `/blog/[slug]` | Individual blog post |
| `/contact` | Map, address, WhatsApp, socials |
| `/404` | Error page |

---

## Home Page Sections

| Section | What it contains |
|---|---|
| Nav | Logo, page links, contact CTA, enrol CTA |
| Hero | Headline, tagline, two CTAs — Enrol Now and View Programmes |
| Marquee | Animated text strip |
| Stats | Students trained, years active, programmes, awards |
| Programmes | One card per programme — includes, schedule, pricing, enrol CTA |
| Schedule | Day-filter tabs — all batches with time, instructor, programme, available slots |
| Instructors | Photo, name, programme, short bio |
| Testimonials | Student quotes with star rating |
| Gallery | Preview grid linking to full gallery |
| Studio Rental | Pricing and booking CTA |
| Awards | Logo and badge strip |
| FAQ | Expandable questions and answers |
| Map + Contact | Embedded map, address, phone, email, socials |
| Footer | Navigation links, contact info, copyright |
| Floating WhatsApp | Persistent, message pre-filled based on current page |
| Announcement banner | Optional top strip, toggled from admin |

---

## Studio Rental Flow

1. Visitor fills rental booking form — name, phone, preferred date and time
2. Request appears in admin dashboard
3. Admin confirms and logs the booking
4. WhatsApp confirmation auto-sent to renter

---

## Student Dashboard

**Route:** `/student` — OTP login via WhatsApp to registered number.

| Section | Details |
|---|---|
| Profile | Name, phone, email, programme, batch, join date, student ID. Edit display name and profile photo |
| My Schedule | Current batch timetable — days and times. Any schedule changes updated by admin reflect here automatically |
| Attendance | Calendar view — Present, Absent, Leave per day. Overall attendance percentage. Last 30 days summary |
| Fees | Current month status — Paid or Due. Pay Now — Razorpay checkout for due amount. Full payment history — all transactions. Next due date. Receipt download per payment |
| Notices | Admin broadcasts relevant to the student's programme. Unread count indicator |
| Kuchipudi Progress | **Shown only for Kuchipudi programme students.** Current level. Module checklist per level. Certificate download when a level is completed — PDF generated on the backend |

---

## Instructor Dashboard

**Route:** `/instructor` — email and password login via Supabase Auth.

Each instructor only sees the batches assigned to them. No access to other instructors' students, classes, or data.

| Section | Details |
|---|---|
| My Classes | List of assigned batches — programme, days, time, student count. View full student list for each batch — name, contact, attendance summary |
| Attendance | Mark attendance per batch per class — Present, Absent, Leave. View and edit attendance history for their classes. Cannot view attendance data outside their assigned batches |
| Student View (read-only) | Basic profile of students in their batch — name, phone, attendance percentage. Cannot access fee data, payment history, or any admin-level information |

---

## Admin Dashboard

**Route:** `/admin` — email and password login via Supabase Auth.

Admin has full visibility across all students, classes, instructors, and payments.

### Students
- All enrolled students across all programmes and batches
- Filter by programme, batch, status (Active / Inactive)
- View individual student profile — all data including payment history and attendance
- Deactivate or reactivate a student
- Export to CSV
- **No manual student creation** — all records come from the enrolment flow

### Classes and Batches
- Create, edit, delete programmes
- Create, edit, delete batches — days, time, instructor assignment, capacity, status
- Status per batch: Active, Paused, Full
- Batch data feeds the public schedule section in real time

### Instructor Management
- Create instructor accounts and assign to batches
- Edit instructor profiles — name, photo, bio, certifications, linked programmes
- Profiles feed the public website instructors section automatically

### Attendance Overview
- View attendance data across all batches and instructors
- Per-student and per-batch views
- Instructors mark their own class attendance — admin can view all of it
- Configurable auto-trigger — WhatsApp sent to student after N consecutive absences

### Fee and Payment Management
- All Razorpay payments auto-logged via webhook — no manual entry needed
- Admin can log offline payments (cash, UPI) if needed
- View payment status across all students
- Flag students overdue beyond N days
- Generate and share Razorpay payment links for offline-preferring students
- Send WhatsApp fee reminders — individual or bulk — with payment link included

### WhatsApp Broadcast
- Send to all students, a specific programme, or a specific batch
- Pre-built templates — fee reminder, schedule change, holiday, event
- Broadcast log — message, recipients, timestamp

### Studio Rental
- Weekly calendar view of all bookings
- Confirm, edit, or cancel bookings from rental requests
- Block time slots for internal use

### Gallery Management
- Upload photos and videos, tag by programme or event
- Drag-and-drop reorder
- Toggle visibility — public or hidden
- Feeds public gallery in real time

### Website Content Controls
- Announcement banner — text, link, active date range, toggle on/off
- FAQ content
- Programme fees and schedule — changes reflect on the public site without a redeploy
- Stats displayed on the home page

### Analytics
- Total active students by programme
- Enrolments this month vs last month
- Revenue this month — Razorpay total + manually logged offline
- Attendance rate across all batches this week
- Batch occupancy — how full each batch is

---

## WhatsApp Automation

Triggered automatically from **Next.js API Route Handlers** (via Supabase DB webhooks or cron). No manual sending except admin broadcasts.

| Trigger | What fires it |
|---|---|
| Enrolment confirmed | Razorpay payment success webhook — welcome message + dashboard login link |
| Payment receipt | Every successful Razorpay payment — receipt summary |
| Fee reminder | Auto N days before due date — includes payment link |
| Absence check-in | N consecutive absences marked by instructor (configurable) |
| Admin broadcast | Admin sends manually from dashboard |
| Studio rental confirmed | Admin confirms a rental request |
| Kuchipudi certificate ready | Level marked complete — certificate download link |
| Schedule change | Admin updates a batch schedule — notifies affected students |

---

## SEO and GEO

### Technical SEO
- Unique title and meta description per page
- Canonical tag on all pages
- H1 to H3 content hierarchy
- Alt text on all images
- WebP format, lazy loading for gallery
- Auto-generated sitemap.xml submitted to Google Search Console
- robots.txt
- OG image (1200 × 630) for home and each programme page
- Favicon set — .ico, 192 px PNG, 512 px PNG
- manifest.json
- Core Web Vitals targets — LCP under 2.5s, CLS under 0.1, INP under 200ms

### Structured Data

| Schema | Page |
|---|---|
| DanceSchool + LocalBusiness | Home |
| FAQPage | Home |
| BreadcrumbList | All pages |
| Course | Each programme page |
| AggregateRating + Review | Home and programme pages |
| ImageGallery | Gallery page |
| Article | Blog posts |

### Local and Geo SEO
- Geo meta on all pages — geo.region, geo.placename, geo.position, ICBM
- NAP consistent across all pages and structured data
- Location-specific copy on programme pages targeting surrounding neighbourhoods
- Google Business Profile NAP aligned with site

---

## Supabase Schema

| Table | Purpose |
|---|---|
| `users` | Auth table — role field (admin, instructor, student) |
| `programmes` | Programme types — name, description, fees, active status |
| `batches` | Batches per programme — days, time, instructor, capacity, status |
| `instructors` | Instructor profiles — name, photo, bio, certifications, linked programmes |
| `students` | Auto-created on payment success — name, phone, programme, batch, join date |
| `attendance` | Per-student per-day — Present, Absent, Leave — written by instructor |
| `fee_payments` | All payment records — Razorpay (auto) and offline (manual) |
| `payment_orders` | Razorpay order records — order ID, amount, status, webhook payload |
| `broadcast_logs` | WhatsApp broadcast history — message, recipients, timestamp |
| `studio_rentals` | Rental requests and confirmed bookings |
| `gallery` | Media — URL, type, tags, visibility, sort order |
| `site_content` | Admin-editable site content — fees, stats, FAQs, banner |
| `kuchipudi_progress` | Level, modules completed, certificate URL — Kuchipudi students only |
| `blog_posts` | Title, slug, content, meta description, tags, published date |

---

## Supabase Features Used

| Feature | Usage |
|---|---|
| Auth | Email and password — admin and instructors. WhatsApp OTP — students |
| Row Level Security | Students see only their own data. Instructors see only their batch data. Admin sees all |
| Storage | Gallery media, profile photos, certificate PDFs |
| Realtime | Admin dashboard live updates — enrolments, attendance |

---

## Out of Scope

- Mobile app — V2
- Recorded class or video library — V2
- Multi-branch support — V2
- Social media content creation
- Ad management
- WhatsApp Business API subscription — client's account and cost
