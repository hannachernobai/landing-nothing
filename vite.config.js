import fs from 'node:fs';
import path from 'node:path';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';
// base потрібен лише для GitHub Pages: https://<user>.github.io/<назва-репозиторію>/
// У GitHub Actions змінна GITHUB_REPOSITORY має вигляд "user/repo", локально її немає
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repo ? `/${repo}/` : '/';

// vituum зберігає зібрану сторінку як index.pug.html, а серверам потрібен index.html
const renamePugHtml = () => {
  let outDir;

  return {
    name: 'rename-pug-html',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      if (!fs.existsSync(outDir)) return;

      for (const file of fs.readdirSync(outDir)) {
        if (file.endsWith('.pug.html')) {
          fs.renameSync(
            path.join(outDir, file),
            path.join(outDir, file.replace('.pug.html', '.html')),
          );
        }
      }
    },
  };
};

export default {
  base,
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: './src' }),
    renamePugHtml(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
};
