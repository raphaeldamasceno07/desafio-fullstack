import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vite.config.ts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['src/**/*.spec.ts', 'src/**/*.e2e-spec.ts'],
      exclude: ['**/node_modules/**'],
      globals: true,
      environment: 'node',
      globalSetup: './vitest.setup.e2e.ts',
      setupFiles: [],
      testTimeout: 30000,
      fileParallelism: false,
    },
  }),
)
