#!/usr/bin/env node
/**
 * Render the share images, one per language, from one composition:
 *
 *   public/images/og/abdulelah-og-en.png   (Fraunces + Inter, left to right)
 *   public/images/og/abdulelah-og-ar.png   (Thmanyah, right to left)
 *
 *   node scripts/generate-og.mjs
 *
 * Both are rendered once in Chrome with the faces the pages use and committed
 * as static files: a request-time renderer cannot shape Arabic (letters come
 * out disconnected) and has no access to the site's fonts. Thmanyah is read
 * from public/fonts; Fraunces and Inter come from Google Fonts, so the
 * English render needs a network connection. Run it again after changing a
 * line below. Fraunces is requested without its optical-size axis, as
 * next/font loads it for the pages. The figures restate data/projects.ts (8 projects, 5 with code).
 */
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const thmanyah = (weight) =>
  `data:font/woff2;base64,${readFileSync(path.join(root, `public/fonts/thmanyah/thmanyahsans-${weight}.woff2`)).toString("base64")}`;

const images = {
  en: {
    dir: "ltr",
    head: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=Inter:wght@400;500&display=block">`,
    fonts: ["500 112px Fraunces", "400 40px Fraunces", "500 22px Inter"],
    css: `
      body { font-family: Inter, sans-serif; }
      .top { font-size: 22px; letter-spacing: .16em; text-transform: uppercase; }
      .name { font-family: Fraunces, serif; font-size: 116px; font-weight: 500; line-height: .98; letter-spacing: -.025em; }
      .line { font-family: Fraunces, serif; font-size: 42px; font-weight: 400; line-height: 1.25; letter-spacing: -.01em; }
    `,
    kicker: "AI product builder · Riyadh",
    first: "Abdulelah",
    last: "Alkhathami",
    line: "I turn AI into products people understand.",
    note: "8 projects, 5 with public code",
    url: "abdulelah.de"
  },
  ar: {
    dir: "rtl",
    head: `<style>
      @font-face { font-family: Thmanyah; src: url("${thmanyah("Regular")}"); font-weight: 400; }
      @font-face { font-family: Thmanyah; src: url("${thmanyah("Medium")}"); font-weight: 500; }
      @font-face { font-family: Thmanyah; src: url("${thmanyah("Bold")}"); font-weight: 700; }
    </style>`,
    fonts: ["700 112px Thmanyah", "500 38px Thmanyah"],
    css: `
      body { font-family: Thmanyah, sans-serif; }
      .top { font-size: 26px; }
      .name { font-size: 112px; font-weight: 700; line-height: 1.16; }
      .line { font-size: 38px; font-weight: 500; line-height: 1.6; }
    `,
    kicker: "مطوّر منتجات ذكاء اصطناعي · الرياض",
    first: "عبدالإله",
    last: "الخثعمي",
    line: "أحوّل الذكاء الاصطناعي إلى منتجات يفهمها الناس.",
    note: "8 مشاريع، 5 منها بكود منشور",
    url: "abdulelah.de/ar"
  }
};

function page(locale, image) {
  return `<!doctype html>
<html lang="${locale}" dir="${image.dir}">
<head>
<meta charset="utf-8">
${image.head}
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: #0a0a0b; color: #f2efe7;
    padding: 72px 84px; display: flex; flex-direction: column; justify-content: space-between;
  }
  body::before {
    content: ""; position: absolute; inset-inline-start: -160px; top: -220px; width: 760px; height: 620px;
    background: radial-gradient(closest-side, rgba(201,167,92,0.16), transparent 72%);
  }
  .top { position: relative; display: flex; align-items: center; gap: 22px; color: #c9a75c; font-weight: 500; }
  .top .rule { width: 42px; height: 1px; background: #c9a75c; opacity: .75; }
  .name { position: relative; }
  /* Solid grey, not alpha: alpha leaves seams at Arabic letter joins. */
  .name span { display: block; color: #9a9893; }
  .line { position: relative; margin-top: 44px; }
  .foot { position: relative; display: flex; align-items: center; justify-content: space-between; color: #8e897f; font-size: 24px; }
  .foot .url { direction: ltr; unicode-bidi: isolate; letter-spacing: .02em; }
  svg { position: absolute; inset-inline-end: 84px; top: 72px; }
  ${image.css}
</style>
</head>
<body>
  <svg width="74" height="64" viewBox="0 0 48 42" fill="none" aria-hidden="true">
    <g stroke="#c9a75c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 37 L14 6 L24 37"/><path d="M24 37 L34 6 L44 37"/><path d="M8 25 H20"/><path d="M28 25 H40"/>
    </g>
  </svg>
  <div class="top"><span class="rule"></span>${image.kicker}</div>
  <div>
    <div class="name">${image.first}<span>${image.last}</span></div>
    <div class="line">${image.line}</div>
  </div>
  <div class="foot"><span>${image.note}</span><span class="url">${image.url}</span></div>
</body>
</html>`;
}

const browser = await chromium.launch({ channel: "chrome" });

for (const [locale, image] of Object.entries(images)) {
  const output = path.join(root, `public/images/og/abdulelah-og-${locale}.png`);
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

  await tab.setContent(page(locale, image), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);

  const missing = await tab.evaluate((fonts) => fonts.filter((font) => !document.fonts.check(font)), image.fonts);

  if (missing.length) throw new Error(`${locale}: fonts not loaded: ${missing.join(", ")}`);

  mkdirSync(path.dirname(output), { recursive: true });
  await tab.screenshot({ path: output, type: "png" });
  await tab.close();
  console.log(`Wrote ${path.relative(root, output)}`);
}

await browser.close();
