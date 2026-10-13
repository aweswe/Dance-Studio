# Rhythmzz Academy — WATI & Meta WhatsApp Template Setup Guide

This guide gives you the exact settings, text, and sample values to create all **10 WhatsApp Templates** in your WATI dashboard (`https://live.wati.io/10267472/messageTemplate`) for instant Meta approval.

---

## ⚡ Quick Rules & Nuances for Meta Approval

1. **Template Name**:
   - Only lowercase letters, numbers, and underscores (`a-z`, `0-9`, `_`).
   - No spaces, hyphens, uppercase, or special symbols. (e.g., `payment_receipt` ✅, `Payment-Receipt` ❌).
2. **Category**:
   - Choose **UTILITY** for all transactional templates (receipts, reminders, absences, rentals).
   - Choose **MARKETING** for `admin_broadcast`.
   - *Why?* Meta rejects templates if the category doesn't match the content. UTILITY conversations also cost less per message than MARKETING.
3. **Language**:
   - Select **English** (or `English (en)`).
4. **Header / Footer / Buttons**:
   - Set Header: **None**
   - Set Footer: **None** (optional, but None gets approved fastest)
   - Set Buttons: **None**
5. **Variables (`{{1}}`, `{{2}}`, etc.)**:
   - Must be sequential: `{{1}}`, `{{2}}`, `{{3}}`.
   - Must have text between them (never put `{{1}} {{2}}` directly next to each other).
6. **Sample Values (MOST IMPORTANT TO PREVENT REJECTION)**:
   - Meta **requires** sample values for each variable before approving.
   - Never use "test", "xxx", or leave them empty. Use the realistic sample values provided below.

---

## 📋 The 10 Templates (Copy-Paste Ready)

---

### Template 1: `payment_receipt`
> **Trigger:** Sent automatically when Razorpay captures a payment.

* **Template Name:** `payment_receipt`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Namaste {{1}}! 🙏

We have successfully received your payment of ₹{{2}} for your dance classes at Rhythmzz Academy of Dance.

Receipt Details:
• Date: {{3}}
• Transaction ID: {{4}}

Thank you for dancing with us!
- Rhythmzz Academy of Dance
```

#### Sample Values:
* `{{1}}`: `Ananya Sharma`
* `{{2}}`: `2500`
* `{{3}}`: `10/10/2026`
* `{{4}}`: `pay_PXYZ8912347`

---

### Template 2: `enrolment_welcome`
> **Trigger:** Sent when a new student is enrolled or portal access is activated.

* **Template Name:** `enrolment_welcome`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Welcome to Rhythmzz Academy of Dance, {{1}}! 💃✨

You are officially enrolled in the {{2}} programme.

Access your student portal to view batch schedules, attendance, and receipts:
{{3}}

See you on the dance floor!
```

#### Sample Values:
* `{{1}}`: `Aarav Patel`
* `{{2}}`: `Kids Bollywood & Hip Hop`
* `{{3}}`: `https://rhythmzz.in/login`

---

### Template 3: `fee_reminder`
> **Trigger:** Daily cron sweep or manual admin fee reminder trigger.

* **Template Name:** `fee_reminder`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Dear {{1}},

This is a gentle reminder that your monthly fee of ₹{{2}} for Rhythmzz Academy of Dance is due on {{3}}.

You can view your invoice and clear your fee online here:
{{4}}

If you have already paid, please ignore this message.
Warm regards,
Rhythmzz Academy Team
```

#### Sample Values:
* `{{1}}`: `Priya Reddy`
* `{{2}}`: `2500`
* `{{3}}`: `31/10/2026`
* `{{4}}`: `https://rhythmzz.in/student/fees`

---

### Template 4: `class_reminder`
> **Trigger:** Scheduled daily at 20:00 IST for tomorrow's classes.

* **Template Name:** `class_reminder`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Hi {{1}}! 🎶

Reminder for your upcoming {{2}} session tomorrow:
⏰ Time: {{3}}
📍 Studio: Rhythmzz Academy of Dance, Madhapur

Please arrive 10 minutes early in your dance attire. See you tomorrow!
```

#### Sample Values:
* `{{1}}`: `Rohan Mehta`
* `{{2}}`: `Adults Contemporary & Jazz`
* `{{3}}`: `07:00 PM - 08:30 PM`

---

### Template 5: `absence_checkin`
> **Trigger:** Sent automatically when a student has 3 consecutive absences.

* **Template Name:** `absence_checkin`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Hi {{1}},

We noticed you have missed {{2}} consecutive sessions of {{3}} at Rhythmzz Academy.

We hope everything is alright! If you are unwell or traveling, please let us know so we can assist with class leave.

Hope to see you back on the dance floor soon!
```

#### Sample Values:
* `{{1}}`: `Kavya Nair`
* `{{2}}`: `3`
* `{{3}}`: `Kuchipudi Classical`

---

### Template 6: `schedule_change`
> **Trigger:** Admin updates batch timings or days.

* **Template Name:** `schedule_change`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Hello {{1}},

Important update regarding your {{2}} batch schedule at Rhythmzz Academy:
• Previous Timing: {{3}}
• New Timing: {{4}}

Please make note of this change. Contact us if you have any scheduling conflicts!
```

#### Sample Values:
* `{{1}}`: `Sneha Rao`
* `{{2}}`: `Mind & Body Fitness`
* `{{3}}`: `Mon-Fri 09:30 AM`
* `{{4}}`: `Mon-Fri 08:30 AM - 09:30 AM`

---

### Template 7: `certificate_ready`
> **Trigger:** Admin uploads a Kuchipudi dance board examination certificate.

* **Template Name:** `certificate_ready`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Congratulations {{1}}! 🎉

Your official Kuchipudi Dance Board Examination Certificate (Level: {{2}}) is ready for collection and download.

Download your digital certificate:
{{3}}

Keep shining and dancing!
Rhythmzz Academy Examination Board
```

#### Sample Values:
* `{{1}}`: `Divya Krishna`
* `{{2}}`: `Praveshika`
* `{{3}}`: `https://rhythmzz.in/student/certificates`

---

### Template 8: `rental_confirmed`
> **Trigger:** Admin approves a studio rehearsal rental booking.

* **Template Name:** `rental_confirmed`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Hello {{1}},

Your studio rental booking at Rhythmzz Academy has been CONFIRMED! 🩰

Booking Details:
• Date: {{2}}
• Slot: {{3}}
• Location: Rhythmzz Academy, Madhapur Studio

Please arrive 5 minutes before your slot. Have a productive session!
```

#### Sample Values:
* `{{1}}`: `Vikram Sinha`
* `{{2}}`: `15/10/2026`
* `{{3}}`: `06:00 PM - 08:00 PM`

---

### Template 9: `rental_cancelled`
> **Trigger:** Admin declines or cancels a studio rental booking.

* **Template Name:** `rental_cancelled`
* **Category:** `UTILITY`
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Hello {{1}},

We are unable to confirm your studio rental request for {{2}} at {{3}} due to studio schedule conflicts.

Please reply to this message or visit our website to check alternative dates and time slots.

Warm regards,
Rhythmzz Academy Team
```

#### Sample Values:
* `{{1}}`: `Rajesh Kumar`
* `{{2}}`: `12/10/2026`
* `{{3}}`: `04:00 PM - 06:00 PM`

---

### Template 10: `admin_broadcast`
> **Trigger:** Admin sends an urgent announcement or holiday notice to all/selected students.

* **Template Name:** `admin_broadcast`
* **Category:** `MARKETING` *(or UTILITY if only operational notices)*
* **Language:** `English`
* **Header:** None
* **Footer:** None
* **Buttons:** None

#### Body Text:
```text
Important announcement from Rhythmzz Academy of Dance:

{{1}}

- Team Rhythmzz
```

#### Sample Values:
* `{{1}}`: `Studio will remain closed tomorrow for festival holiday. All classes resume on Monday morning as per schedule.`

---

## 🛠️ Step-by-Step Creation in WATI UI

1. Open your WATI browser tab: `https://live.wati.io/10267472/messageTemplate`
2. Click **+ New Template Message** (top right green button).
3. Fill in the top fields:
   - **Template Name**: Paste the exact template name (e.g. `payment_receipt`).
   - **Category**: Select **Utility** (or Marketing for broadcast).
   - **Language**: Select **English**.
4. In the **Body** text box:
   - Copy & paste the exact text from this guide.
5. In the **Sample Values** section below the body:
   - WATI will show boxes for `{{1}}`, `{{2}}`, etc.
   - Paste the sample values from this guide.
6. Click **Save and Submit** (or **Submit for Approval**).
7. Repeat for each of the 10 templates.

> [!NOTE]
> Meta approval usually takes between **2 minutes to 2 hours**. Once the status changes from `PENDING` to `APPROVED` in WATI, the Next.js app will immediately start sending them automatically via your configured API key!
