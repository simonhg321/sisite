import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Deploy target: https://instockornot.club/Simon/
export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  site: 'https://instockornot.club',
  base: '/Simon',
});
