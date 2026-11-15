import { defineConfig } from 'vite';
import { copyFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Existing lower sections and the catalogue use root-relative brand assets.
export default defineConfig({
  plugins: [{ name: 'preserve-brand-assets', closeBundle() {
    for (const file of readdirSync('.')) {
      if (/\.(png|jpe?g)$/i.test(file)) copyFileSync(resolve(file), resolve('dist', file));
    }
  } }],
});
