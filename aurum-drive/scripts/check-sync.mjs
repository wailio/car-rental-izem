import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Check home page
  await page.goto("https://izem-motors.vercel.app/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Check services title
  const servicesTitle = await page.locator("#prestations h2").innerText();
  console.log("Live Services Title:", servicesTitle.replace(/\s+/g, ' ').trim());

  // Check how it works
  const hiwSection = page.locator("#comment-ca-marche");
  const box = await hiwSection.boundingBox();
  console.log("Live HowItWorks Height:", box?.height, "px");

  // 2. Check /vehicules page
  await page.goto("https://izem-motors.vercel.app/vehicules", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const headerBtnCount = await page.locator("header .btn-key").count();
  console.log("Live /vehicules header reserve button count (should be 0):", headerBtnCount);

  await browser.close();
}

main().catch(console.error);
