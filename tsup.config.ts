import 'dotenv/config';
import { defineConfig } from 'tsup';
//minor change
export default defineConfig({
  entry: [
    'src/functional/index.ts',
    'src/functional/maybe/index.ts',
    'src/functional/result/index.ts',
    'src/random/index.ts',
    'src/range/index.ts',
  ],
  external: [],
  format: ['esm', 'cjs'],
  esbuildPlugins: [],
  dts: true,
});
