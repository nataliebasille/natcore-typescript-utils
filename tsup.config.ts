import 'dotenv/config';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'functional/index.ts',
    'functional/maybe/index.ts',
    'functional/result/index.ts',
    'random/index.ts',
    'range/index.ts',
  ],
  external: [],
  format: ['esm', 'cjs'],
  esbuildPlugins: [],
  dts: true,
});
