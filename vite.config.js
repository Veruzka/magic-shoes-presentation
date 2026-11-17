// Two pages: the story (index.html) and the lab (lab/index.html, served at /lab/).
// BASE_PATH is set by the GitHub Pages workflow (.github/workflows/pages.yml), because
// Pages serves the site from a sub-folder: /magic-shoes-presentation/. Locally it's '/'.
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: {
    rollupOptions: {
      input: {
        story: resolve(import.meta.dirname, 'index.html'),
        lab: resolve(import.meta.dirname, 'lab/index.html'),
      },
    },
  },
});
