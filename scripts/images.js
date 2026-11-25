// npm run images — з images-src/ генерує AVIF + WebP + JPEG у кількох ширинах у src/assets/images/
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'images-src';
const OUT = 'src/assets/images';

// Ширини під розміри з макета (Image logic), з запасом для retina.
// Значення мають збігатися з `widths` у src/data/site.pug та src/pages/index.pug.
const WIDTHS = {
  hero: [712, 1244, 1920, 2520],
  banner: [744, 1260, 1592],
  'product-1': [324, 600, 750],
  'product-2': [324, 600, 1200],
  'product-3': [324, 600, 750],
  // широкі фото категорій (1344 px)
  'category-1': [392, 672, 1344],
  'category-4': [392, 672, 1344],
  'category-5': [392, 672, 1344],
  // квадратні фото категорій (648 px)
  'category-2': [184, 324, 648],
  'category-3': [184, 324, 648],
  'category-6': [184, 324, 648],
};

const FORMATS = {
  avif: (img) => img.avif({ quality: 50 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.jpeg({ quality: 80, mozjpeg: true }),
};

await fs.mkdir(OUT, { recursive: true });

const files = (await fs.readdir(SRC)).filter((f) => /\.(webp|png|jpe?g)$/i.test(f));

for (const file of files) {
  const name = path.parse(file).name;
  const widths = WIDTHS[name];

  if (!widths) {
    console.warn(`skip ${file}: no widths configured`);
    continue;
  }

  for (const width of widths) {
    for (const [ext, encode] of Object.entries(FORMATS)) {
      const out = path.join(OUT, `${name}-${width}.${ext}`);
      const image = sharp(path.join(SRC, file)).resize({ width, withoutEnlargement: true });
      await encode(image).toFile(out);
    }
  }

  console.log(`✔ ${file}`);
}
