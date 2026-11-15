import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440px
  const desktopPage = await browser.newPage({
    viewport: { width: 1440, height: 1100 }
  });
  await desktopPage.goto('http://localhost:3006', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(1000);

  const sectionDesktop = desktopPage.locator('#prestations');
  await sectionDesktop.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(600);

  // Normal Desktop Screenshot
  await sectionDesktop.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-services-desktop.png'
  });
  console.log('Saved screenshot-services-desktop.png');

  // Hover first cell
  const firstCell = sectionDesktop.locator('a.group').first();
  await firstCell.hover();
  await desktopPage.waitForTimeout(400);
  await sectionDesktop.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-services-desktop-hover.png'
  });
  console.log('Saved screenshot-services-desktop-hover.png');
  await desktopPage.close();

  // 2. Tablet 768px
  const tabletPage = await browser.newPage({
    viewport: { width: 768, height: 1024 }
  });
  await tabletPage.goto('http://localhost:3006', { waitUntil: 'domcontentloaded' });
  await tabletPage.waitForTimeout(1000);
  const sectionTablet = tabletPage.locator('#prestations');
  await sectionTablet.scrollIntoViewIfNeeded();
  await tabletPage.waitForTimeout(600);
  await sectionTablet.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-services-tablet.png'
  });
  console.log('Saved screenshot-services-tablet.png');
  await tabletPage.close();

  // 3. Mobile 390px
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  await mobilePage.goto('http://localhost:3006', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);
  const sectionMobile = mobilePage.locator('#prestations');
  await sectionMobile.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);
  await sectionMobile.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-services-mobile-390.png'
  });
  console.log('Saved screenshot-services-mobile-390.png');
  await mobilePage.close();

  // 4. Small Mobile 320px
  const smallPage = await browser.newPage({
    viewport: { width: 320, height: 600 },
    isMobile: true
  });
  await smallPage.goto('http://localhost:3006', { waitUntil: 'domcontentloaded' });
  await smallPage.waitForTimeout(1000);
  const sectionSmall = smallPage.locator('#prestations');
  await sectionSmall.scrollIntoViewIfNeeded();
  await smallPage.waitForTimeout(600);
  await sectionSmall.screenshot({
    path: 'C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-services-mobile-320.png'
  });
  console.log('Saved screenshot-services-mobile-320.png');
  await smallPage.close();

  await browser.close();
}

main().catch(console.error);
