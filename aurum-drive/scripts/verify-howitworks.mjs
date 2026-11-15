import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440px
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await desktopPage.waitForTimeout(2000);

  const section = desktopPage.locator("#comment-ca-marche");
  await section.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(1000);

  const box = await section.boundingBox();
  console.log("Desktop container height:", box?.height, "px (Target: <= 400px)");

  await section.screenshot({
    path: "C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-howitworks-desktop.png",
  });
  console.log("Desktop screenshot saved!");
  await desktopPage.close();

  // 2. Mobile 390px
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await mobilePage.waitForTimeout(2000);

  const mobileSection = mobilePage.locator("#comment-ca-marche");
  await mobileSection.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1000);

  await mobileSection.screenshot({
    path: "C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-howitworks-mobile-390.png",
  });
  console.log("Mobile 390 screenshot saved!");
  await mobilePage.close();

  // 3. Small Mobile 320px
  const smallMobilePage = await browser.newPage({ viewport: { width: 320, height: 600 } });
  await smallMobilePage.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await smallMobilePage.waitForTimeout(2000);

  const smallMobileSection = smallMobilePage.locator("#comment-ca-marche");
  await smallMobileSection.scrollIntoViewIfNeeded();
  await smallMobilePage.waitForTimeout(1000);

  await smallMobileSection.screenshot({
    path: "C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-howitworks-mobile-320.png",
  });
  console.log("Mobile 320 screenshot saved!");
  await smallMobilePage.close();

  await browser.close();
}

main().catch(console.error);
