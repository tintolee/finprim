import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',   // <-- this is key
    globals: true,           // optional: allows using describe/it without importing
  },
})