import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    functional: 'functional/index.ts',
    random: 'random/index.ts',
    range: 'range/index.ts',
  },
  external: [],
  format: ['esm', 'cjs'],
  esbuildPlugins: [],
  dts: true,
});
