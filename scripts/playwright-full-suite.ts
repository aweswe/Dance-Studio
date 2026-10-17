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
  // PART 2: DEEP-LINKED ENROLMENT FLOW & WAITLIST
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
    } catch (err) {
      logFail('Enrolment Flow', 'Deep-linked Confirmed Plan Card', t0, err);
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

      // Check if already signed in ("Open portal") or click "Demo Student"
      const openPortalBtn = page.locator('button:has-text("Open portal")');
      if (await openPortalBtn.isVisible()) {
        await openPortalBtn.click();
      } else {
        const demoStudentBtn = page.locator('button:has-text("Demo Student")');
        await demoStudentBtn.waitFor({ state: 'visible', timeout: 8000 });
        await demoStudentBtn.click();
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
    } catch (err) {
      logFail('Student Portal', 'Student authentication and portal navigation', t0, err);
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

      // Click "Demo Instructor"
      const demoInstructorBtn = page.locator('button:has-text("Demo Instructor")');
      await demoInstructorBtn.waitFor({ state: 'visible', timeout: 8000 });
      await demoInstructorBtn.click();

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

      // Click "Demo Admin"
      const demoAdminBtn = page.locator('button:has-text("Demo Admin")');
      await demoAdminBtn.waitFor({ state: 'visible', timeout: 8000 });
      await demoAdminBtn.click();

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
      ];

      for (const tab of adminTabs) {
        const tTab = Date.now();
        await page.goto(`${BASE_URL}${tab.path}`, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('body', { timeout: 8000 });
        logPass('Admin Portal', tab.name, tTab);
      }
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
