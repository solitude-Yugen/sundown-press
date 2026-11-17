import { defineConfig } from 'vite';
import { copyFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';

// Existing lower sections and the catalogue use root-relative brand assets.
export default defineConfig({
  build: { rollupOptions: { input: Object.fromEntries(
    ['index', 'digital-greetings', 'printed-keepsakes', 'weddings', 'photo-booth', 'contact']
      .map(page => [page, resolve(`${page}.html`)])) } },
  plugins: [tailwindcss(), { name: 'preserve-brand-assets', closeBundle() {
    for (const file of readdirSync('.')) {
      if (/\.(png|jpe?g)$/i.test(file)) copyFileSync(resolve(file), resolve('dist', file));
    }
  } }],
});
