module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.(test).ts'],
  coverageDirectory: 'coverage/e2e',
  collectCoverageFrom: ['/**/*.ts', '!/**/*.test.ts'],
  coverageProvider: 'v8',
  clearMocks: true,
  maxWorkers: 1,
};
