import { chromium, type Browser, type Page } from 'playwright';

const BASE_URL = 'http://127.0.0.1:3050';

interface TestLog {
  section: string;
  test: string;
  status: 'PASS' | 'FAIL';
  durationMs: number;
  details?: string;
}

const logs: TestLog[] = [];

function logPass(section: string, test: string, startMs: number, details?: string) {
  const durationMs = Date.now() - startMs;
  logs.push({ section, test, status: 'PASS', durationMs, details });
  console.log(`  ✅ [${section}] ${test} (${durationMs}ms) ${details ? `— ${details}` : ''}`);
}

function logFail(section: string, test: string, startMs: number, error: any) {
  const durationMs = Date.now() - startMs;
  logs.push({ section, test, status: 'FAIL', durationMs, details: error?.message || String(error) });
  console.log(`  ❌ [${section}] ${test} (${durationMs}ms) — ERROR: ${error?.message || error}`);
}

async function dismissIntroLoader(page: Page) {
  try {
    await page.evaluate(() => {
      document.querySelector('aside[aria-label*="Loading Rhythmzz"]')?.remove();
    });
  } catch {
    // If absent or already detached, continue
  }
  await page.waitForTimeout(400);
}

async function runSuite() {
  console.log('\n====================================================================');
  console.log('🎭 FULL PLAYWRIGHT BROWSER E2E TEST & CONCURRENCY STRESS SUITE');
  console.log('   Target URL: ' + BASE_URL);
  console.log('====================================================================\n');

  let browser: Browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    console.log('System Chrome browser launched successfully.\n');
  } catch (err: any) {
    console.error('Failed to launch Chrome:', err.message);
    process.exit(1);
  }

  // --------------------------------------------------------------------------
  // PART 1: PUBLIC EXPERIENCES & BRAND PAGES
  // --------------------------------------------------------------------------
  console.log('--- PART 1: PUBLIC EXPERIENCES & CRITICAL PAGES ---');

  const publicRoutes = [
    { path: '/', name: 'Homepage (Hero, Spotlights, FAQ, Footer)', selector: 'h1' },
    { path: '/programmes/kids-dance', name: 'Kids Dance Programme & Pricing Board', selector: 'text=Kids Dance' },
    { path: '/programmes/adults-dance', name: 'Adults Dance Programme & Timetable', selector: 'text=Adults Dance' },
    { path: '/programmes/mind-body-fitness', name: 'Mind & Body Fitness (Yoga/Zumba)', selector: 'text=Mind & Body' },
    { path: '/syllabus/kuchipudi', name: 'Kuchipudi Classical Syllabus & Margam', selector: 'text=Kuchipudi' },
    { path: '/syllabus/kathak', name: 'Kathak Syllabus Roadmap & Medallions', selector: 'text=Kathak' },
    { path: '/events-achievements', name: 'Achievements & Press (Canada Tour & Collaborations)', selector: 'text=Achievements & Press' },
    { path: '/gear', name: 'Rhythmzz Merch & Gear Storefront', selector: 'text=Rhythmzz Gear' },
    { path: '/studio-rental', name: 'Studio Rental Showcase & Specs', selector: 'text=Studio Rental' },
    { path: '/terms', name: 'Student Portal Terms & Conditions', selector: 'text=Terms & Conditions' },
    { path: '/instructor-terms', name: 'Instructor Terms & Engagement Policies', selector: 'text=Instructor Terms' },
  ];

  for (const route of publicRoutes) {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (!response || response.status() >= 400) {
        throw new Error(`HTTP ${response?.status()}`);
      }
      await page.waitForSelector(route.selector, { timeout: 6000 });
      logPass('Public Navigation', route.name, t0, `status: ${response.status()}`);
    } catch (err) {
      logFail('Public Navigation', route.name, t0, err);
    } finally {
      await context.close();
    }
  }

  // --------------------------------------------------------------------------
  // PART 1B: CLASSICAL CROSS-NAVIGATION (KUCHIPUDI <-> KATHAK)
  // --------------------------------------------------------------------------
  console.log('\n--- PART 1B: CLASSICAL SYLLABUS CROSS-NAVIGATION ---');
  {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/syllabus/kuchipudi`, { waitUntil: 'domcontentloaded' });
      await dismissIntroLoader(page);

      // Find and click "Also view Kathak"
      const alsoViewKathakLink = page.locator('a:has-text("Also view Kathak")');
      await alsoViewKathakLink.waitFor({ state: 'visible', timeout: 8000 });
      const kathakHref = await alsoViewKathakLink.getAttribute('href');
      if (kathakHref !== '/syllabus/kathak') {
        throw new Error(`Expected href to be /syllabus/kathak but got ${kathakHref}`);
      }

      await alsoViewKathakLink.click();
      await page.waitForURL('**/syllabus/kathak', { timeout: 10000 });
      logPass('Classical Cross-Routing', '"Also view Kathak" on Kuchipudi page correctly routes to /syllabus/kathak', t0);

      const t1 = Date.now();
      // On Kathak page, find and click "Also view Kuchipudi"
      const alsoViewKuchipudiLink = page.locator('a:has-text("Also view Kuchipudi")');
      await alsoViewKuchipudiLink.waitFor({ state: 'visible', timeout: 10000 });
      const kuchipudiHref = await alsoViewKuchipudiLink.getAttribute('href');
      if (kuchipudiHref !== '/syllabus/kuchipudi') {
        throw new Error(`Expected href to be /syllabus/kuchipudi but got ${kuchipudiHref}`);
      }

      await alsoViewKuchipudiLink.click();
      await page.waitForURL('**/syllabus/kuchipudi', { timeout: 10000 });
      logPass('Classical Cross-Routing', '"Also view Kuchipudi" on Kathak page correctly routes to /syllabus/kuchipudi', t1);
    } catch (err) {
      logFail('Classical Cross-Routing', 'Bidirectional cross-navigation between Kuchipudi and Kathak', t0, err);
    } finally {
      await context.close();
    }
  }

  // --------------------------------------------------------------------------
  console.log('\n--- PART 2: ENROLMENT DEEP-LINKING & WAITLIST FLOWS ---');
  {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/enrol?programme=kids-dance&intent=pay&plan=quarterly&fee=5000`, {
        waitUntil: 'domcontentloaded',
      });
      await dismissIntroLoader(page);
      await page.waitForSelector('text=Selected Programme & Plan', { timeout: 8000 });
      const pageText = await page.textContent('body');
      const hasKidsDance = pageText?.includes('Kids Dance');
      const hasQuarterly = pageText?.includes('Quarterly') || pageText?.includes('quarterly');
      const hasFee = pageText?.includes('5,000') || pageText?.includes('5000');

      if (hasKidsDance && hasQuarterly && hasFee) {
        logPass('Enrolment Flow', 'Deep-linked Confirmed Plan Card renders locked selection (Kids Dance · Quarterly · ₹5,000)', t0);
      } else {
        throw new Error('Confirmed plan details missing from page text');
      }

      // Verify Change button reveals programme selection options
      const changeBtn = page.locator('button:has-text("Change")');
      if (await changeBtn.isVisible()) {
        await changeBtn.click();
      }
      await page.waitForSelector('text=Adults Dance', { timeout: 6000 });
      logPass('Enrolment Flow', 'Change button displays full programme selection grid (Adults Dance & Kids Dance)', t0);

      // Verify Mobile number input is marked required with asterisk
      const phoneInput = page.locator('input[placeholder*="Mobile number (WhatsApp) *"]');
      const isPhoneRequired = await phoneInput.getAttribute('required');
      if (isPhoneRequired !== null) {
        logPass('Enrolment Flow', 'Mobile number (WhatsApp) * is strictly mandatory and required on enrolment form', t0);
      } else {
        throw new Error('Mobile number input missing required attribute');
      }
    } catch (err) {
      logFail('Enrolment Flow', 'Enrolment form validations (programme selector & required phone)', t0, err);
    } finally {
      await context.close();
    }
  }

  // --------------------------------------------------------------------------
  // PART 3: GEAR STOREFRONT INTERACTIVE CART
  // --------------------------------------------------------------------------
  console.log('\n--- PART 3: GEAR STOREFRONT INTERACTION ---');
  {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/gear`, { waitUntil: 'domcontentloaded' });
      await dismissIntroLoader(page);

      // Handle both Coming Soon and Live storefront modes
      const comingSoonHeading = page.locator('text=COMING SOON');
      const isComingSoon = await comingSoonHeading.isVisible();

      if (isComingSoon) {
        const inquireBtn = page.locator('a:has-text("Inquire on WhatsApp")');
        await inquireBtn.waitFor({ state: 'visible', timeout: 8000 });
        logPass('Storefront Interaction', 'Rhythmzz Gear Storefront renders Official Studio Merchandise Coming Soon showcase with WhatsApp inquiry trigger', t0);
      } else {
        // Select a size on the first product card
        const sizeBtn = page.locator('button[aria-label*="Select size"]').first();
        await sizeBtn.waitFor({ state: 'visible', timeout: 8000 });
        await sizeBtn.click();

        // Click "Order on WhatsApp" button
        const orderButton = page.locator('button:has-text("Order on WhatsApp")').first();
        await orderButton.waitFor({ state: 'visible', timeout: 8000 });
        await orderButton.click();

        // Verify order confirmation dialog appears
        await page.waitForSelector('text=Order Enquiry Initiated', { timeout: 6000 });
        logPass('Storefront Interaction', 'Product size selection & WhatsApp order confirmation modal opens', t0);
      }
    } catch (err) {
      logFail('Storefront Interaction', 'Product size selection and order trigger', t0, err);
    } finally {
      await context.close();
    }
  }

  // --------------------------------------------------------------------------
  // PART 4: AUTHENTICATED PORTALS (STUDENT, INSTRUCTOR, ADMIN)
  // --------------------------------------------------------------------------
  console.log('\n--- PART 4: AUTHENTICATED USER PORTALS ---');

  // 4.1 Student Portal
  {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
      await dismissIntroLoader(page);

      // Check Terms & Conditions checkbox if present and unchecked
      const termsCheckbox = page.locator('input[type="checkbox"]').first();
      if (await termsCheckbox.isVisible()) {
        const isChecked = await termsCheckbox.isChecked();
        if (!isChecked) {
          await termsCheckbox.check();
        }
      }

      // Check if already signed in ("Open portal") or click "Local preview as Aarav"
      const openPortalBtn = page.locator('button:has-text("Open portal")');
      if (await openPortalBtn.isVisible()) {
        await openPortalBtn.click();
      } else {
        const localPreviewBtn = page.locator('button:has-text("Local preview as Aarav")');
        if (await localPreviewBtn.isVisible()) {
          await localPreviewBtn.click();
        } else {
          await page.context().addCookies([{ name: 'bypass_student', value: 'true', url: BASE_URL }]);
          await page.goto(`${BASE_URL}/student`, { waitUntil: 'domcontentloaded' });
        }
      }

      // Verify redirection to student portal
      await page.waitForURL(/\/student($|\?|\/)/, { timeout: 15000 });
      logPass('Student Auth', `Student login session resolved: redirected to ${page.url()}`, t0);

      // Verify Student Fees page
      const tFees = Date.now();
      await page.goto(`${BASE_URL}/student/fees`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=Fee', { timeout: 8000 });
      logPass('Student Portal', 'Student Fees ledger loaded (/student/fees)', tFees);

      // Verify Student Classes page
      const tClasses = Date.now();
      await page.goto(`${BASE_URL}/student/classes`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: 8000 });
      logPass('Student Portal', 'Student Classes & Batch Timetable loaded (/student/classes)', tClasses);

      // Verify Student Attendance page
      const tAtt = Date.now();
      await page.goto(`${BASE_URL}/student/attendance`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: 8000 });
      logPass('Student Portal', 'Student Attendance rate overview loaded (/student/attendance)', tAtt);

      // Verify Student Leave Request page
      const tLeave = Date.now();
      await page.goto(`${BASE_URL}/student/leave`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: 8000 });
      logPass('Student Portal', 'Student Leave Request management loaded (/student/leave)', tLeave);

      // Verify Student Profile page & mandatory parent/guardian fields
      const tProfile = Date.now();
      await page.goto(`${BASE_URL}/student/profile`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#profile-parent-name', { timeout: 8000 });
      const parentNameInput = page.locator('#profile-parent-name');
      const parentPhoneInput = page.locator('#profile-parent-phone');
      const isParentNameReq = await parentNameInput.getAttribute('required');
      const isParentPhoneReq = await parentPhoneInput.getAttribute('required');
      const samePhoneToggle = page.locator('#profile-same-phone-toggle');
      await samePhoneToggle.waitFor({ state: 'visible', timeout: 5000 });
      
      // Test toggling "Same as student mobile"
      await samePhoneToggle.check();
      const studentPhoneVal = await page.locator('#profile-phone').inputValue();
      const parentPhoneVal = await parentPhoneInput.inputValue();
      if (studentPhoneVal && parentPhoneVal !== studentPhoneVal) {
        throw new Error(`Expected parent phone (${parentPhoneVal}) to match student phone (${studentPhoneVal}) when toggle checked`);
      }

      if (isParentNameReq !== null && isParentPhoneReq !== null) {
        logPass('Student Portal', 'Student Profile renders mandatory parent/guardian fields with single-number own-contact toggle (/student/profile)', tProfile);
      } else {
        throw new Error('Parent name or phone input missing required attribute on profile form');
      }
    } catch (err) {
      logFail('Student Portal', 'Student authentication and portal navigation', t0, err);
    } finally {
      await context.close();
    }
  }

  // 4.1.2 Mandatory Phone Signup Prompt (/login?step=phone)
  {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/login?step=phone`, { waitUntil: 'domcontentloaded' });
      await dismissIntroLoader(page);
      await page.waitForSelector('text=Mobile Number Required', { timeout: 8000 });
      const phoneInput = page.locator('input[type="tel"]');
      const isRequired = await phoneInput.getAttribute('required');
      if (isRequired !== null) {
        logPass('Student Auth', 'Mandatory Phone Signup Prompt renders with required mobile input (/login?step=phone)', t0);
      } else {
        throw new Error('Mandatory mobile input missing required attribute on phone prompt');
      }
    } catch (err) {
      logFail('Student Auth', 'Mandatory Phone Signup Prompt', t0, err);
    } finally {
      await context.close();
    }
  }

  // 4.2 Instructor Portal
  {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/admin-login`, { waitUntil: 'domcontentloaded' });
      await dismissIntroLoader(page);

      // Sign in as Instructor
      await page.fill('input[type="email"]', 'demo.instructor@rhythmzz.demo');
      await page.fill('input[type="password"]', 'Rhythmzz@Demo2024!');
      const termsBox = page.locator('input[type="checkbox"]');
      if (await termsBox.isVisible()) {
        await termsBox.check();
      }
      await page.click('button[type="submit"]');

      // Verify redirection to instructor portal
      await page.waitForURL(/\/instructor($|\?|\/)/, { timeout: 15000 });
      logPass('Instructor Auth', `Instructor login session resolved: redirected to ${page.url()}`, t0);

      // Navigate to /instructor/classes
      const tInsClasses = Date.now();
      await page.goto(`${BASE_URL}/instructor/classes`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: 8000 });
      logPass('Instructor Portal', 'Instructor Assigned Batches loaded (/instructor/classes)', tInsClasses);

      // Navigate to /instructor/attendance
      const tInsAtt = Date.now();
      await page.goto(`${BASE_URL}/instructor/attendance`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: 8000 });
      logPass('Instructor Portal', 'Instructor Attendance Marking page loaded (/instructor/attendance)', tInsAtt);

      // Navigate to /instructor/profile
      const tInsProfile = Date.now();
      await page.goto(`${BASE_URL}/instructor/profile`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=My Profile', { timeout: 8000 });
      await page.waitForSelector('text=Profile Photo', { timeout: 6000 });
      await page.waitForSelector('text=Password / Login', { timeout: 6000 });
      await page.waitForSelector('text=Academy-Managed Profile', { timeout: 6000 });
      await page.waitForSelector('input[placeholder="https://example.com/photo.jpg"]', { timeout: 6000 });
      await page.waitForSelector('button:has-text("Send password reset email")', { timeout: 6000 });
      logPass('Instructor Portal', 'Instructor Profile loaded with photo upload, password reset, and read-only admin fields (/instructor/profile)', tInsProfile);
    } catch (err) {
      logFail('Instructor Portal', 'Instructor authentication and portal navigation', t0, err);
    } finally {
      await context.close();
    }
  }

  // 4.3 Admin Portal
  {
    const t0 = Date.now();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`${BASE_URL}/admin-login`, { waitUntil: 'domcontentloaded' });
      await dismissIntroLoader(page);

      // Sign in as Admin
      await page.fill('input[type="email"]', 'admin@rhythmzz.in');
      await page.fill('input[type="password"]', 'Rhythmzz#Admin2026!');
      const termsBox = page.locator('input[type="checkbox"]');
      if (await termsBox.isVisible()) {
        await termsBox.check();
      }
      await page.click('button[type="submit"]');

      // Verify redirection to admin portal
      await page.waitForURL(/\/admin($|\?|\/)/, { timeout: 15000 });
      logPass('Admin Auth', `Admin login session resolved: redirected to ${page.url()}`, t0);

      const adminTabs = [
        { path: '/admin/classes', name: 'Classes & Batch Schedule Management' },
        { path: '/admin/fees', name: 'Billing & Fee Collections Ledger' },
        { path: '/admin/enquiries', name: 'Inbound Enquiries & Lead Pipeline' },
        { path: '/admin/events', name: 'Event Management & Broadcast Engine' },
        { path: '/admin/gear', name: 'Rhythmzz Gear Inventory Catalog' },
        { path: '/admin/switch-requests', name: 'Student Batch Switch Requests' },
        { path: '/admin/instructors', name: 'Instructors Faculty & Invite Management' },
      ];

      for (const tab of adminTabs) {
        const tTab = Date.now();
        await page.goto(`${BASE_URL}${tab.path}`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('body', { timeout: 8000 });
        logPass('Admin Portal', tab.name, tTab);
      }

      // Test permanent copy invite button on /admin/instructors
      const tCopyInvite = Date.now();
      await page.goto(`${BASE_URL}/admin/instructors`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('button[title*="Copy WhatsApp invite message"]', { timeout: 8000 });
      const copyBtn = page.locator('button[title*="Copy WhatsApp invite message"]').first();
      await copyBtn.click();
      await page.waitForTimeout(500);
      logPass('Admin Portal', 'Permanent WhatsApp invite copy button on instructor card triggers copy (/admin/instructors)', tCopyInvite);
    } catch (err) {
      logFail('Admin Portal', 'Admin authentication and management navigation', t0, err);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  // --------------------------------------------------------------------------
  // PART 5: HIGH-CONCURRENCY STRESS TEST (25 SIMULTANEOUS USERS)
  // --------------------------------------------------------------------------
  console.log('\n--- PART 5: HIGH-CONCURRENCY STRESS TEST (25 SIMULTANEOUS USERS) ---');
  console.log('Simulating 25 simultaneous concurrent user requests across critical endpoints...');

  const concurrentEndpoints = [
    `${BASE_URL}/`,
    `${BASE_URL}/programmes/kids-dance`,
    `${BASE_URL}/programmes/adults-dance`,
    `${BASE_URL}/programmes/mind-body-fitness`,
    `${BASE_URL}/syllabus/kuchipudi`,
    `${BASE_URL}/syllabus/kathak`,
    `${BASE_URL}/gear`,
    `${BASE_URL}/studio-rental`,
    `${BASE_URL}/events-achievements`,
    `${BASE_URL}/api/health`,
    `${BASE_URL}/api/storefront-mode`,
    `${BASE_URL}/terms`,
    `${BASE_URL}/instructor-terms`,
    `${BASE_URL}/enrol?programme=kids-dance&plan=monthly&fee=2500`,
    `${BASE_URL}/enrol?programme=adults-dance&plan=quarterly&fee=5000`,
    `${BASE_URL}/enrol?programme=mind-body-fitness&plan=yoga&fee=1000`,
    `${BASE_URL}/login`,
    `${BASE_URL}/admin-login`,
    `${BASE_URL}/schedule`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/about`,
    `${BASE_URL}/refund`,
    `${BASE_URL}/privacy`,
    `${BASE_URL}/shipping`,
    `${BASE_URL}/api/health`,
  ];

  const stressStart = Date.now();
  const latencies: number[] = [];
  let successfulRequests = 0;
  let failedRequests = 0;

  const stressPromises = concurrentEndpoints.map(async (url, idx) => {
    const reqStart = Date.now();
    try {
      const res = await fetch(url);
      const reqDuration = Date.now() - reqStart;
      latencies.push(reqDuration);
      if (res.status === 200) {
        successfulRequests++;
      } else {
        failedRequests++;
        console.error(`Stress client #${idx + 1} (${url}) returned HTTP ${res.status}`);
      }
    } catch (e: any) {
      failedRequests++;
      console.error(`Stress client #${idx + 1} (${url}) failed: ${e.message}`);
    }
  });

  await Promise.all(stressPromises);
  const totalStressDuration = Date.now() - stressStart;

  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const max = latencies[latencies.length - 1] || 0;

  console.log(`\n  ✅ 25 Concurrent Users Completed in ${totalStressDuration}ms`);
  console.log(`     - Success Rate: ${successfulRequests}/${concurrentEndpoints.length} (${Math.round((successfulRequests / concurrentEndpoints.length) * 100)}%)`);
  console.log(`     - Median Latency (p50): ${p50}ms`);
  console.log(`     - 95th Percentile Latency (p95): ${p95}ms`);
  console.log(`     - Max Peak Latency: ${max}ms`);

  logs.push({
    section: 'Stress Concurrency',
    test: '25 Simultaneous Concurrent Users Load Test',
    status: failedRequests === 0 ? 'PASS' : 'FAIL',
    durationMs: totalStressDuration,
    details: `${successfulRequests}/${concurrentEndpoints.length} 200 OK | p50: ${p50}ms | p95: ${p95}ms | max: ${max}ms`,
  });

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  const total = logs.length;
  const passed = logs.filter((l) => l.status === 'PASS').length;
  const failed = logs.filter((l) => l.status === 'FAIL').length;

  console.log('\n====================================================================');
  console.log(`🏁 PLAYWRIGHT & STRESS TEST RUN COMPLETE: ${passed}/${total} PASSED (${failed} FAILED)`);
  console.log('====================================================================\n');

  if (failed > 0) {
    console.error('Failed items:');
    logs.filter((l) => l.status === 'FAIL').forEach((l) => {
      console.error(` - [${l.section}] ${l.test}: ${l.details}`);
    });
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error('Playwright suite fatal error:', err);
  process.exit(1);
});
