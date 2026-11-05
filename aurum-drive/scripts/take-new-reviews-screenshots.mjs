import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to reviews section
  const reviewsHeading = page.locator('text=Avis de nos Clients').first();
  await reviewsHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Screenshot homepage reviews section
  await page.screenshot({ path: 'scripts/homepage_reviews_section.png', fullPage: false });
  console.log('Saved scripts/homepage_reviews_section.png');

  // Click on "Voir plus d'avis (136)" button to open modal
  const openModalBtn = page.locator('text=Voir plus d\'avis').first();
  await openModalBtn.click();
  await page.waitForTimeout(600);

  // Screenshot modal with background filter
  await page.screenshot({ path: 'scripts/reviews_modal_open.png', fullPage: false });
  console.log('Saved scripts/reviews_modal_open.png');

  // Test searching inside the modal
  const searchInput = page.locator('input[placeholder*="Rechercher par client"]').first();
  await searchInput.fill('Alger');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scripts/reviews_modal_search.png', fullPage: false });
  console.log('Saved scripts/reviews_modal_search.png');

  // Close modal with escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // Navigate to /avis page
  console.log('Navigating to /avis page...');
  await page.goto('http://localhost:3000/avis', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'scripts/avis_page_new.png', fullPage: false });
  console.log('Saved scripts/avis_page_new.png');

  await browser.close();
  console.log('All screenshots taken successfully!');
}

takeScreenshots().catch(err => {
  console.error(err);
  process.exit(1);
});
