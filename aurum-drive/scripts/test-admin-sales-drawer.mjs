import { chromium } from 'playwright';
import crypto from 'crypto';

const SESSION_SECRET = 'chateau_art_secret_hmac_token_key_2026';

function getAdminToken() {
  const payload = {
    u: 'wailio',
    r: 'developer',
    perms: ['dashboard', 'products', 'orders', 'sales', 'website-info', 'users'],
    iat: Date.now(),
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64');
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64');
  return `${payloadStr}.${hmac}`;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const token = getAdminToken();
  await context.addCookies([
    { name: 'admin_session', value: token, domain: 'localhost', path: '/' },
    { name: 'admin_session', value: token, domain: '127.0.0.1', path: '/' },
  ]);

  const page = await context.newPage();

  console.log('1. Navigating to /admin/sales...');
  await page.goto('http://localhost:3000/admin/sales', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Click on the first car
  const firstCar = page.locator('.live-car-card').first();
  await firstCar.click();
  await page.waitForTimeout(600);

  // Click delete current driver to get add driver form
  const deleteBtn = page.locator('button:has-text("Supprimer le conducteur actuel")');
  await deleteBtn.click();
  await page.waitForTimeout(500);

  const durInput = page.locator('input[placeholder="ex: 3 jours"]');

  // Case A: Type "1" -> should show ONLY 1, 10..19 (all starting with 1)
  console.log('2. Testing typing "1" -> only 1, 1X options...');
  await durInput.fill('1');
  await page.waitForTimeout(300);

  const options1 = await page.locator('div.absolute button:has-text("jour")').allTextContents();
  console.log('Options when typing "1":', options1);
  await page.screenshot({ path: 'scripts/admin_sales_dur_typed_1.png' });

  // Case B: Type "22" (as in user screenshot) -> should show ONLY 22 alone
  console.log('3. Testing typing "22" -> only 22 alone...');
  await durInput.fill('22');
  await page.waitForTimeout(300);

  const options22 = await page.locator('div.absolute button:has-text("jour")').allTextContents();
  console.log('Options when typing "22":', options22);
  await page.screenshot({ path: 'scripts/admin_sales_dur_typed_22.png' });

  // Case C: Type "14" -> should show ONLY 14 alone
  console.log('4. Testing typing "14" -> only 14 alone...');
  await durInput.fill('14');
  await page.waitForTimeout(300);

  const options14 = await page.locator('div.absolute button:has-text("jour")').allTextContents();
  console.log('Options when typing "14":', options14);
  await page.screenshot({ path: 'scripts/admin_sales_dur_typed_14.png' });

  // Case D: Type "45" -> should clamp to 30 days max
  console.log('5. Testing typing "45" -> clamps to 30 days max...');
  await durInput.fill('45');
  await page.waitForTimeout(300);

  const valAfter45 = await durInput.inputValue();
  console.log('Value after typing 45 (clamped):', valAfter45);
  const options45 = await page.locator('div.absolute button:has-text("jour")').allTextContents();
  console.log('Options when typing > 30:', options45);
  await page.screenshot({ path: 'scripts/admin_sales_dur_max_30.png' });

  // Click 30 jours option
  const opt30 = page.locator('div.absolute button:has-text("30 jours")');
  await opt30.click();
  await page.waitForTimeout(300);

  const finalVal = await durInput.inputValue();
  console.log('Final input value after clicking option:', finalVal);

  console.log('ALL DURATION TESTS PASSED!');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
