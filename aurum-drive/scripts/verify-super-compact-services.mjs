import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1440px
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await desktopPage.waitForTimeout(2000);

  const section = desktopPage.locator("#prestations");
  await section.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(1000);

  await section.screenshot({
    path: "C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-services-super-compact.png",
  });
  console.log("Desktop screenshot saved!");
  await desktopPage.close();

  // 2. Mobile 390px
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await mobilePage.waitForTimeout(2000);

  const mobileSection = mobilePage.locator("#prestations");
  await mobileSection.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1000);

  await mobileSection.screenshot({
    path: "C:/Users/hp/.gemini/antigravity/brain/32ef24e4-b01b-44e0-ab73-59043f5d39fc/screenshot-services-super-compact-mobile.png",
  });
  console.log("Mobile screenshot saved!");
  await mobilePage.close();

  await browser.close();
}

main().catch(console.error);
