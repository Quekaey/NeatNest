import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = new URL('../test-results/visual/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/about', '/services', '/faq', '/contact']) {
      await page.goto(`http://127.0.0.1:5187${path}`);
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(image => image.decode());
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const filename = `${path === '/' ? 'home' : path.slice(1)}-${width}.png`;
      await page.screenshot({ path: fileURLToPath(new URL(filename, output)), fullPage: true });
      console.log(filename);
    }
  }
  const { photos } = JSON.parse(await readFile(new URL('../public/assets/photos/sources.json', import.meta.url), 'utf8'));
  const tiles = [];
  for (const photo of photos) {
    const bytes = await readFile(new URL(`../public/assets/photos/${photo.file}-small.webp`, import.meta.url));
    tiles.push(`<figure><img src="data:image/webp;base64,${bytes.toString('base64')}"><figcaption>${photo.placement}</figcaption></figure>`);
  }
  for (const file of ['living-room', 'office', 'interior', 'cleaning']) {
    const bytes = await readFile(new URL(`../public/images/${file}.jpg`, import.meta.url));
    tiles.push(`<figure><img src="data:image/jpeg;base64,${bytes.toString('base64')}"><figcaption>OLD: ${file}</figcaption></figure>`);
  }
  await page.setViewportSize({ width: 1400, height: 1200 });
  await page.setContent(`<style>body{margin:20px;font:14px Arial;background:#eee;display:grid;grid-template-columns:repeat(4,1fr);gap:16px}figure{margin:0}img{width:100%;height:200px;object-fit:cover}figcaption{padding:8px;background:white}</style>${tiles.join('')}`);
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await page.screenshot({ path: fileURLToPath(new URL('photo-selection.png', output)), fullPage: true });
} finally {
  await browser.close();
}
