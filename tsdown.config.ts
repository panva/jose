import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    treeshake: true,
    hash: true,
    attw: true,
    shims: true,
    platform: 'neutral'
})