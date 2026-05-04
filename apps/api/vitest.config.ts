import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@portfolio/types': resolve(__dirname, '../../packages/types/src/index.ts'),
      '@portfolio/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
    },
  },
})
