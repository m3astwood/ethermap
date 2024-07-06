import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'backend',
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  extensionsToTreatAsEsm: [ '.ts' ],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest', {
        tsconfig: 'backend/tsconfig.back.json',
        useESM: true
      }
    ]
  },
}

export default config

