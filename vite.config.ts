/// <reference types="vitest" />
import path from 'node:path'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './frontend/',
  base: '/',
  envDir: '../',
  build: {
    sourcemap: true,
    target: ['esnext', 'edge100', 'firefox100', 'chrome100', 'safari18'],
    outDir: '../dist/frontend',
  },
  resolve: {
    alias: {
      '@': path.resolve('./'),
    },
  },
  test: {
    root: './',
    hookTimeout: 30000,
  },
  plugins: [
    devServer({
      export: 'app',
      entry: 'backend/app.ts',
    }),
  ],
})
