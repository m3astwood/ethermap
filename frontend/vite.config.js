import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    sourcemap: true,
    target: [ 'esnext', 'edge100', 'firefox100', 'chrome100', 'safari18' ]
  }
})
