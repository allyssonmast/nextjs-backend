module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
      '<rootDir>/test/**/*.spec.ts',
    ],
    coverageDirectory: 'coverage/e2e',
    collectCoverageFrom: [
      'test/**/*.ts',
      '!test/**/*.spec.ts',
    ],
    coverageProvider: 'v8',
    clearMocks: true,
    maxWorkers: 1,
  };
  