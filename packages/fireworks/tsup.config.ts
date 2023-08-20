import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  dts: true,
  external: [
    'animejs',
    '@ctrl/tinycolor',
  ],
})
