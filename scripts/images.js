// npm run images — з images-src/ генерує AVIF + WebP + JPEG у кількох ширинах у src/assets/images/
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'images-src';
const OUT = 'src/assets/images';

// ширини за префіксом імені файлу (не збільшуємо понад оригінал)
const WIDTHS = {
  work: [400, 714],
  journal: [150, 300],
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
  const widths = WIDTHS[name.split('-')[0]];

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
