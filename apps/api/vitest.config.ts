import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vite.config.ts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['src/**/*.{test,spec}.ts'],
      exclude: ['**/node_modules/**', '**/*e2e*', 'src/http/controllers/**/*'],
      globals: true,
      environment: 'node',
    },
  }),
)
