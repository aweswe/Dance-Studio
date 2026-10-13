# Rhythmzz Academy of Dance — Automation Messages & Templates Catalog

**Document Type:** Complete Communications & Automation Inventory  
**Scope:** All WhatsApp message templates, automated cron triggers, interactive web chat messages, and student lifecycle notifications  
**Date:** October 2026  
**Status:** Live & Production Ready  

---

## Table of Contents

1. [Overview & Message Architecture](#1-overview--message-architecture)
2. [Category A: Outbound Transactional & Operational Messages (Backend Driven)](#2-category-a-outbound-transactional--operational-messages-backend-driven)
   - [1. Enrolment Welcome & Portal Credentials](#1-enrolment-welcome--portal-credentials)
   - [2. Instant Payment Receipt](#2-instant-payment-receipt)
   - [3. Monthly Fee Due Reminder](#3-monthly-fee-due-reminder)
   - [4. Night-Before Class Reminder](#4-night-before-class-reminder)
   - [5. 3-Absence Retention Check-In](#5-3-absence-retention-check-in)
   - [6. Batch Schedule Change Alert](#6-batch-schedule-change-alert)
   - [7. Kuchipudi Board Exam Certificate Ready](#7-kuchipudi-board-exam-certificate-ready)
   - [8. Admin Emergency & Studio Broadcast](#8-admin-emergency--studio-broadcast)
3. [Category B: Studio Rental Booking Messages](#3-category-b-studio-rental-booking-messages)
   - [9. Studio Rental Approved & Confirmed](#9-studio-rental-approved--confirmed)
   - [10. Studio Rental Declined / Unavailable](#10-studio-rental-declined--unavailable)
4. [Category C: Internal Staff Alerts (Admin Notifications)](#4-category-c-internal-staff-alerts-admin-notifications)
   - [11. New Contact Form Lead Alert](#11-new-contact-form-lead-alert)
   - [12. New Enrolment / Trial Request Alert](#12-new-enrolment--trial-request-alert)
5. [Category D: Interactive Web-to-WhatsApp Pre-Composed Messages](#5-category-d-interactive-web-to-whatsapp-pre-composed-messages)
   - [13. Free Trial Booking Request](#13-free-trial-booking-request)
   - [14. Enrol & Pay Online Lead](#14-enrol--pay-online-lead)
   - [15. Programme Pricing Card Inquiries](#15-programme-pricing-card-inquiries)
   - [16. Context-Aware Floating WhatsApp Button](#16-context-aware-floating-whatsapp-button)
   - [17. Faculty Job Application ("Teach With Us")](#17-faculty-job-application-teach-with-us)
   - [18. Student Portal "Pay on WhatsApp" Link](#18-student-portal-pay-on-whatsapp-link)
   - [19. Workshop & Event RSVP Link](#19-workshop--event-rsvp-link)
6. [Category E: Planned WATI Chatbot & Student Lifecycle Flows](#6-category-e-planned-wati-chatbot--student-lifecycle-flows)
   - [20. WhatsApp Merchandise Order & Human Handoff](#20-whatsapp-merchandise-order--human-handoff)
   - [21. 24-Hour Post-Trial Follow-Up & Coupon](#21-24-hour-post-trial-follow-up--coupon)
   - [22. 30-Day Google Review Collector](#22-30-day-google-review-collector)
   - [23. Student Birthday Greeting & Guest Pass](#23-student-birthday-greeting--guest-pass)
   - [24. Annual Showcase / Workshop Ticket Reservation](#24-annual-showcase--workshop-ticket-reservation)
7. [Category F: Authentication & Portal In-App Mirroring](#7-category-f-authentication--portal-in-app-mirroring)
   - [25. Phone / Email OTP Sign-In](#25-phone--email-otp-sign-in)
   - [26. Student Dashboard In-App Notice Feed Mirror](#26-student-dashboard-in-app-notice-feed-mirror)
8. [Summary Matrix: Templates, Variables & Channels](#8-summary-matrix-templates-variables--channels)

---

## 1. Overview & Message Architecture

The application communicates with students, prospects, renters, and faculty across **three distinct communication channels**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          COMMUNICATION CHANNELS IN RHYTHMZZ                            │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ CHANNEL TYPE             │ PROTOCOL / PROVIDER         │ USE CASES                     │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ Server-to-User Outbound  │ WATI / Interakt REST API    │ Receipts, Reminders, Notices, │
│                          │                             │ Certificates, Absences        │
│ User-to-Studio Inbound   │ Click-to-Chat (wa.me)       │ Trials, Merch, Pricing,       │
│                          │                             │ Jobs, Event RSVPs             │
│ In-Portal Mirror Feed    │ Supabase broadcast_logs     │ Web notices dashboard         │
│                          │                             │ (English, Telugu, Hindi)      │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

All outbound WhatsApp messages utilize **Meta-approved templates** with dynamic variable substitution (`{{1}}`, `{{2}}`, etc.) to comply with WhatsApp Business API regulations.

---

## 2. Category A: Outbound Transactional & Operational Messages (Backend Driven)

### 1. Enrolment Welcome & Portal Credentials
* **Template Name:** `enrolment_welcome`
* **Trigger Event:** 
  1. Automated trigger when Razorpay payment is completed (`src/lib/payments/fulfill-order.ts`).
  2. Admin manually activates student portal login in admin dashboard (`src/actions/students.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Student Name, `{{2}}` Programme Name, `{{3}}` Login Portal URL

#### Template Text:
```text
Welcome to Rhythmzz Academy of Dance, {{1}}! 💃✨

You are officially enrolled in the {{2}} programme.

Access your student portal to view batch schedules, attendance, and receipts:
{{3}}

See you on the dance floor!
```

#### Real-World Rendered Example:
```text
Welcome to Rhythmzz Academy of Dance, Ananya Sharma! 💃✨

You are officially enrolled in the Kids Bollywood & Hip Hop programme.

Access your student portal to view batch schedules, attendance, and receipts:
https://rhythmzz.in/login

See you on the dance floor!
```

---

### 2. Instant Payment Receipt
* **Template Name:** `payment_receipt`
* **Trigger Event:** Automated immediately upon successful Razorpay transaction capture (`src/lib/payments/fulfill-order.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Student Name, `{{2}}` Amount in ₹, `{{3}}` Payment Date, `{{4}}` Razorpay Payment ID

#### Template Text:
```text
Namaste {{1}}! 🙏

We have successfully received your payment of ₹{{2}} for your dance classes at Rhythmzz Academy of Dance.

Receipt Details:
• Date: {{3}}
• Transaction ID: {{4}}

Thank you for dancing with us!
- Rhythmzz Academy of Dance
```

#### Real-World Rendered Example:
```text
Namaste Rohit Verma! 🙏

We have successfully received your payment of ₹2500 for your dance classes at Rhythmzz Academy of Dance.

Receipt Details:
• Date: 08/10/2026
• Transaction ID: pay_PXYZ8912347

Thank you for dancing with us!
- Rhythmzz Academy of Dance
```

---

### 3. Monthly Fee Due Reminder
* **Template Name:** `fee_reminder`
* **Trigger Event:** 
  1. Scheduled GitHub Actions cron sweep at 09:00 IST (`src/app/api/cron/fee-reminders/route.ts`).
  2. Single or bulk fee reminder clicked by admin in dashboard (`src/actions/fees.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Student Name, `{{2}}` Due Amount in ₹, `{{3}}` Due Date, `{{4}}` Online Payment Link

#### Template Text:
```text
Dear {{1}},

This is a gentle reminder that your monthly fee of ₹{{2}} for Rhythmzz Academy of Dance is due on {{3}}.

You can view your invoice and clear your fee online here:
{{4}}

If you have already paid, please ignore this message.
Warm regards,
Rhythmzz Academy Team
```

#### Real-World Rendered Example:
```text
Dear Priya Reddy,

This is a gentle reminder that your monthly fee of ₹2500 for Rhythmzz Academy of Dance is due on 31 Oct.

You can view your invoice and clear your fee online here:
https://rhythmzz.in/student/fees

If you have already paid, please ignore this message.
Warm regards,
Rhythmzz Academy Team
```

---

### 4. Night-Before Class Reminder
* **Template Name:** `class_reminder`
* **Trigger Event:** Scheduled daily cron at 20:00 IST (`src/app/api/cron/class-reminders/route.ts`). Queries tomorrow's active batches and alerts enrolled students.
* **Meta Category:** Utility
* **Variables:** `{{1}}` Student Name, `{{2}}` Programme/Batch Name, `{{3}}` Batch Time Slot

#### Template Text:
```text
Hi {{1}}! 🎶

Reminder for your upcoming {{2}} session tomorrow:
⏰ Time: {{3}}
📍 Studio: Rhythmzz Academy of Dance, Madhapur

Please arrive 10 minutes early in your dance attire. See you tomorrow!
```

#### Real-World Rendered Example:
```text
Hi Aarav Patel! 🎶

Reminder for your upcoming Adults Bollywood & Hip Hop session tomorrow:
⏰ Time: 07:00 PM – 08:30 PM
📍 Studio: Rhythmzz Academy of Dance, Madhapur

Please arrive 10 minutes early in your dance attire. See you tomorrow!
```

---

### 5. 3-Absence Retention Check-In
* **Template Name:** `absence_checkin`
* **Trigger Event:** Instructor marks a student absent 3 times consecutively on attendance sheet (`src/actions/attendance.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Student Name, `{{2}}` Consecutive Absence Count (`3`), `{{3}}` Programme Name

#### Template Text:
```text
Hi {{1}},

We noticed you have missed {{2}} consecutive sessions of {{3}} at Rhythmzz Academy.

We hope everything is alright! If you are unwell or traveling, please let us know so we can assist with class leave.

Hope to see you back on the dance floor soon!
```

#### Real-World Rendered Example:
```text
Hi Kavya Nair,

We noticed you have missed 3 consecutive sessions of Kuchipudi Classical at Rhythmzz Academy.

We hope everything is alright! If you are unwell or traveling, please let us know so we can assist with class leave.

Hope to see you back on the dance floor soon!
```

---

### 6. Batch Schedule Change Alert
* **Template Name:** `schedule_change`
* **Trigger Event:** Admin reschedules a batch or changes timings in studio dashboard (`src/actions/studio.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Student Name, `{{2}}` Programme Name, `{{3}}` Old Schedule, `{{4}}` New Schedule

#### Template Text:
```text
Hello {{1}},

Important update regarding your {{2}} batch schedule at Rhythmzz Academy:
• Previous Timing: {{3}}
• New Timing: {{4}}

Please make note of this change. Contact us if you have any scheduling conflicts!
```

#### Real-World Rendered Example:
```text
Hello Sneha Rao,

Important update regarding your Mind & Body Fitness batch schedule at Rhythmzz Academy:
• Previous Timing: Mon–Fri · 9:30 AM
• New Timing: Mon–Fri · 8:30 AM – 9:30 AM

Please make note of this change. Contact us if you have any scheduling conflicts!
```

---

### 7. Kuchipudi Board Exam Certificate Ready
* **Template Name:** `certificate_ready`
* **Trigger Event:** Admin marks exam passed and uploads certificate PDF (`src/actions/kuchipudi.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Student Name, `{{2}}` Board Level, `{{3}}` PDF Download URL

#### Template Text:
```text
Congratulations {{1}}! 🎉

Your official Kuchipudi Dance Board Examination Certificate (Level: {{2}}) is ready for collection and download.

Download your digital certificate:
{{3}}

Keep shining and dancing!
Rhythmzz Academy Examination Board
```

#### Real-World Rendered Example:
```text
Congratulations Divya Krishna! 🎉

Your official Kuchipudi Dance Board Examination Certificate (Level: Praveshika) is ready for collection and download.

Download your digital certificate:
https://rhythmzz.in/certificates/kuchipudi-praveshika-divya.pdf

Keep shining and dancing!
Rhythmzz Academy Examination Board
```

---

### 8. Admin Emergency & Studio Broadcast
* **Template Name:** `admin_broadcast`
* **Trigger Event:** Admin dispatches announcement to all, batch, or programme in `/admin/broadcast` (`src/actions/broadcast.ts`).
* **Queueing:** Queued in `broadcast_queue` and drained in throttled batches of 25 every 5 minutes (`src/app/api/cron/broadcast/route.ts`).
* **Meta Category:** Marketing / Utility (depending on submission context)
* **Variables:** `{{1}}` Custom Message Body

#### Template Text:
```text
Important announcement from Rhythmzz Academy of Dance:

{{1}}

- Team Rhythmzz
```

#### Real-World Rendered Example:
```text
Important announcement from Rhythmzz Academy of Dance:

Studio closed tomorrow (Friday) for Deepavali celebrations. Regular batches resume Saturday morning!

- Team Rhythmzz
```

---

## 3. Category B: Studio Rental Booking Messages

### 9. Studio Rental Approved & Confirmed
* **Template Name:** `rental_confirmed`
* **Trigger Event:** Admin clicks "Confirm" on a rental booking in `/admin/studio-rental` (`src/actions/rentals.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Renter Name, `{{2}}` Date, `{{3}}` Confirmed Time Slot

#### Template Text:
```text
Hello {{1}},

Your studio rental booking at Rhythmzz Academy has been CONFIRMED! 🩰

Booking Details:
• Date: {{2}}
• Slot: {{3}}
• Location: Rhythmzz Academy, Madhapur Studio

Please arrive 5 minutes before your slot. Have a productive session!
```

#### Real-World Rendered Example:
```text
Hello Vikram Sinha,

Your studio rental booking at Rhythmzz Academy has been CONFIRMED! 🩰

Booking Details:
• Date: 2026-10-15
• Slot: 06:00 PM - 08:00 PM
• Location: Rhythmzz Academy, Madhapur Studio

Please arrive 5 minutes before your slot. Have a productive session!
```

---

### 10. Studio Rental Declined / Unavailable
* **Template Name:** `rental_cancelled`
* **Trigger Event:** Admin declines or cancels a rental booking (`src/actions/rentals.ts`).
* **Meta Category:** Utility
* **Variables:** `{{1}}` Renter Name, `{{2}}` Requested Date, `{{3}}` Requested Slot

#### Template Text:
```text
Hello {{1}},

We are unable to confirm your studio rental request for {{2}} at {{3}} due to studio schedule conflicts.

Please reply to this message or visit our website to check alternative dates and time slots.

Warm regards,
Rhythmzz Academy Team
```

#### Real-World Rendered Example:
```text
Hello Rajesh Kumar,

We are unable to confirm your studio rental request for 2026-10-12 at 04:00 PM - 06:00 PM due to studio schedule conflicts.

Please reply to this message or visit our website to check alternative dates and time slots.

Warm regards,
Rhythmzz Academy Team
```

---

## 4. Category C: Internal Staff Alerts (Admin Notifications)

These messages alert the Academy Director and Front Desk phone (`9052980859`) whenever visitors interact on the public website.

### 11. New Contact Form Lead Alert
* **File:** `src/actions/enquiries.ts` (`submitEnquiry`)
* **Recipient:** Academy Admin WhatsApp (`9052980859`)
* **Format:**
```text
New enquiry from [Name] ([Phone]): [Message Snippet]
```
* **Real-World Example:**
```text
New enquiry from Meera Iyer (+919876543210): Hi, do you offer weekend morning batches for contemporary dance for working professionals?
```

---

### 12. New Enrolment / Trial Request Alert
* **File:** `src/actions/enquiries.ts` (`submitEnrolLead`)
* **Recipient:** Academy Admin WhatsApp (`9052980859`)
* **Format:**
```text
New [trial/pay] from [Child Name] ([Phone]): [Details Summary]
```
* **Real-World Example:**
```text
New trial from Riya (+919876543210): Free trial request · Parent: Sunita · Age: 8 · Programme: Kids Dance · Batch: Mon & Wed 5:00 PM
```

---

## 5. Category D: Interactive Web-to-WhatsApp Pre-Composed Messages

These pre-structured messages load instantly when a website visitor clicks a button or link, allowing seamless conversations.

### 13. Free Trial Booking Request
* **Source:** Free Trial form submission on `/enrol` (`src/components/public/enrol-form.tsx`)
* **Pre-Composed Message Body:**
```text
Hi Rhythmzz! I'd like to book a free trial class.
Student: Aarav
Parent: Rajesh
Age: 7
Programme: Kids Dance
Batch: Mon & Wed · 5:00 PM – 6:00 PM
Phone: 9876543210
```

---

### 14. Enrol & Pay Online Lead
* **Source:** Fallback or direct WhatsApp payment on `/enrol` (`src/components/public/enrol-form.tsx`)
* **Pre-Composed Message Body:**
```text
Hi Rhythmzz! I'd like to enrol and pay.
Student: Aarav
Parent: Rajesh
Age: 7
Programme: Kids Dance
Batch: Mon & Wed · 5:00 PM – 6:00 PM
Plan: Monthly (₹2,500)
Phone: 9876543210
```

---

### 15. Programme Pricing Card Inquiries
* **Source:** "Enquire on WhatsApp" CTA on `/programmes` (`src/components/public/programme-pricing-board.tsx`)
* **Pre-Composed Message Body:**
```text
Hi Rhythmzz! I'd like to enquire about Kids Dance.
Monthly: ₹2,500 · Quarterly: ₹6,500.
Please share batch timings and how to book.
```

---

### 16. Context-Aware Floating WhatsApp Button
* **Source:** Persistent bottom-right floating widget (`src/components/public/whatsapp-float.tsx`)
* **Dynamic Route Messages:**
  * **On `/enrol?intent=pay`:**
    ```text
    Hi, I am trying to enrol and pay at Rhythmzz Academy and need a hand.
    ```
  * **On `/enrol`:**
    ```text
    Hi, I would like to book a free trial class at Rhythmzz Academy.
    ```
  * **On `/programmes/...`:**
    ```text
    Hi, I would like to know more about a programme at Rhythmzz Academy.
    ```
  * **On any other page:**
    ```text
    Hi, I would like to know more about the classes at Rhythmzz Academy.
    ```

---

### 17. Faculty Job Application ("Teach With Us")
* **Source:** Faculty submission form on `/teach-with-us` (`src/components/public/teach-with-us-form.tsx`)
* **Pre-Composed Message Body:**
```text
Hi Rhythmzz! Faculty application submitted via website.
Name: Arjun Kapoor
Phone: 9876543210
Email: arjun.dance@gmail.com
Styles / Disciplines: Hip Hop, Locking, Popping
Experience: 4 years teaching experience
Portfolio/Instagram: @arjun_moves
Notes: Available for weekday evening and weekend batches.
```

---

### 18. Student Portal "Pay on WhatsApp" Link
* **Source:** Inactive Razorpay fallback or manual UPI in student portal (`src/components/student/fee-status-card.tsx`)
* **Pre-Composed Message Body:**
```text
Hi Rhythmzz Academy! I would like to pay my fee of ₹2500 (due 5th of this month). Please share the payment link.
```

---

### 19. Workshop & Event RSVP Link
* **Source:** Event details page on `/events/[slug]` (`src/app/(public)/events/[slug]/page.tsx`)
* **Pre-Composed Message Body:**
```text
Hi Rhythmzz, RSVP for Summer Dance Intensive Workshop — 15 Nov, 2026
```

---

## 6. Category E: Planned WATI Chatbot & Student Lifecycle Flows

These 5 strategic automations are detailed in the [WhatsApp Automation Blueprint](file:///c:/Users/adars/Desktop/Dance-Studio/docs/WHATSAPP-AUTOMATION-BLUEPRINT.md).

### 20. WhatsApp Merchandise Order & Human Handoff
* **Trigger:** Pre-composed `#MERCH-` click on merchandise cards.
* **Customer Inbound:**
  ```text
  Hi Rhythmzz, I'd like to order: Ghungroo 4-Row (Size: M, Qty: 1) #MERCH-04
  ```
* **Automated WATI Bot Response:**
  ```text
  Thanks for your order! Ghungroo 4-Row is ₹850. Please reply with:
  1) Delivery Address
  2) Preferred payment method (UPI / Studio pickup)
  ```
* **Bot Action:** Tags conversation as `[Merch-Order]` and alerts Front Desk inbox for payment link dispatch.

---

### 21. 24-Hour Post-Trial Follow-Up & Coupon
* **Trigger:** 24 hours after a prospect attends a trial class session.
* **Message Body:**
  ```text
  Hi {{1}}! How was your trial class with Nitish Sir? 💃

  We hope you enjoyed the rhythm and energy!
  Quick Reply Buttons:
  [Loved it! Enrol Now] [Have Questions]
  ```
* **Action:** Tapping *"Loved it"* returns early-bird ₹500 discount code valid for 48 hours.

---

### 22. 30-Day Google Review Collector
* **Trigger:** Student completes 30 days of active membership.
* **Message Body:**
  ```text
  Namaste {{1}}! 🙏

  Congratulations on completing your first month at Rhythmzz Academy! 💃✨

  Could you take 30 seconds to share your experience on Google? It means the world to our instructors:
  https://g.page/r/rhythmzz-academy/review

  Thank you for dancing with us!
  ```

---

### 23. Student Birthday Greeting & Guest Pass
* **Trigger:** Daily 09:00 IST sweep where `students.dob` matches today.
* **Message Body:**
  ```text
  Happy Birthday, {{1}}! 🎂🎉✨

  Wishing you a wonderful year filled with rhythm, music, and joy!

  As a small birthday gift from Team Rhythmzz, here is a complimentary 1-Class Guest Pass for a friend or family member to join you this week!
  ```

---

### 24. Annual Showcase / Workshop Ticket Reservation
* **Trigger:** Mass campaign when tickets for Annual Showcase go on sale.
* **Message Body:**
  ```text
  Get ready to shine on stage! 🌟

  Tickets are now open for the Rhythmzz Annual Dance Showcase at Shilpakala Vedika.

  Reserve your family seats below:
  Quick Reply Buttons:
  [Book 2 Tickets] [Book 4 Tickets] [View Show Guide]
  ```

---

## 7. Category F: Authentication & Portal In-App Mirroring

### 25. Phone / Email OTP Sign-In
* **File:** `src/app/(auth)/login/page.tsx`
* **Protocol:** Supabase Auth via SMS OTP / WhatsApp OTP
* **Format:**
  ```text
  Your Rhythmzz Academy portal login verification code is: 492015. Valid for 10 minutes.
  ```

---

### 26. Student Dashboard In-App Notice Feed Mirror
* **File:** `src/lib/notices/log-portal-notice.ts` & `src/app/student/notices/page.tsx`
* **Mechanism:** Every automated broadcast or cron reminder writes a corresponding entry into `broadcast_logs`.
* **Features:**
  * Reaches students who may not have WhatsApp active.
  * Multi-language support: Telugu (`message_te`), Hindi (`message_hi`), and English (`message`).
  * Unread indicator badges via `notice_reads` table tracking.

---

## 8. Summary Matrix: Templates, Variables & Channels

| # | Message Name | Channel | Meta Category | Required Variables | Code Reference |
|---|---|:---:|:---:|---|---|
| **1** | Enrolment Welcome | WhatsApp API | Utility | `student_name`, `programme_name`, `login_url` | `src/lib/payments/fulfill-order.ts` |
| **2** | Payment Receipt | WhatsApp API | Utility | `student_name`, `amount`, `date`, `transaction_id` | `src/lib/payments/fulfill-order.ts` |
| **3** | Monthly Fee Due | WhatsApp API | Utility | `student_name`, `amount`, `due_date`, `payment_link` | `src/app/api/cron/fee-reminders/route.ts` |
| **4** | Class Reminder | WhatsApp API | Utility | `student_name`, `programme_name`, `time` | `src/app/api/cron/class-reminders/route.ts` |
| **5** | 3-Absence Alert | WhatsApp API | Utility | `student_name`, `absence_count`, `programme_name` | `src/actions/attendance.ts` |
| **6** | Schedule Change | WhatsApp API | Utility | `student_name`, `programme_name`, `old_schedule`, `new_schedule` | `src/actions/studio.ts` |
| **7** | Certificate Ready | WhatsApp API | Utility | `student_name`, `level`, `download_url` | `src/actions/kuchipudi.ts` |
| **8** | Studio Broadcast | WhatsApp API | Marketing / Utility | `message` | `src/actions/broadcast.ts` |
| **9** | Rental Confirmed | WhatsApp API | Utility | `renter_name`, `date`, `time` | `src/actions/rentals.ts` |
| **10** | Rental Declined | WhatsApp API | Utility | `renter_name`, `date`, `time` | `src/actions/rentals.ts` |
| **11** | Contact Form Alert | WhatsApp API | Utility | `name`, `phone`, `message` | `src/actions/enquiries.ts` |
| **12** | Enrol Lead Alert | WhatsApp API | Utility | `childName`, `phone`, `mode`, `details` | `src/actions/enquiries.ts` |
| **13** | Trial Booking Click | wa.me Link | Inbound | `Student`, `Parent`, `Age`, `Programme`, `Batch` | `src/components/public/enrol-form.tsx` |
| **14** | Enrol & Pay Click | wa.me Link | Inbound | `Student`, `Plan`, `Fee`, `Programme`, `Batch` | `src/components/public/enrol-form.tsx` |
| **15** | Pricing Card Click | wa.me Link | Inbound | `Programme`, `Monthly`, `Quarterly` | `src/components/public/programme-pricing-board.tsx` |
| **16** | Floating WhatsApp | wa.me Link | Inbound | Dynamic page-aware inquiry | `src/components/public/whatsapp-float.tsx` |
| **17** | Teach With Us | wa.me Link | Inbound | `Name`, `Styles`, `Experience`, `Portfolio` | `src/components/public/teach-with-us-form.tsx` |
| **18** | Pay on WhatsApp | wa.me Link | Inbound | `Student`, `Amount`, `DueDate` | `src/components/student/fee-status-card.tsx` |
| **19** | Event RSVP | wa.me Link | Inbound | `EventTitle`, `Date` | `src/app/(public)/events/[slug]/page.tsx` |
| **20** | Merch Order | WATI Bot | Service | Product ID, Size, Quantity, Address | WATI Visual Bot Builder |
| **21** | Post-Trial Nudge | Scheduled | Utility | `student_name`, Discount Coupon | WATI / Cron Webhook |
| **22** | Google Review | Scheduled | Utility | `student_name`, Google Maps URL | Automated 30-day Sweep |
| **23** | Birthday Greeting | Scheduled | Marketing | `student_name`, 1-Class Pass | Daily 09:00 IST Sweep |
| **24** | Showcase Tickets | WhatsApp API | Marketing | Event Name, Seat Tiers | WATI Campaign Broadcast |
| **25** | Login OTP | SMS / WA | Authentication | 6-digit verification code | Supabase Auth API |
| **26** | Portal Notice Feed | Database | In-App Feed | `message`, `message_te`, `message_hi` | `src/lib/notices/log-portal-notice.ts` |

---

*Document compiled and maintained by Rhythmzz Academy Technical Operations.*
