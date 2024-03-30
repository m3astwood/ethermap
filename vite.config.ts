import { defineConfig } from 'vite'

export default defineConfig({
  root: 'frontend/',
  base: '/',
  build: {
    sourcemap: true,
    target: ['esnext', 'edge100', 'firefox100', 'chrome100', 'safari18'],
    outDir: '../dist/frontend/'
  },
})
