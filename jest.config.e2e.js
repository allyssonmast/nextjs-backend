module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/modules/**/*.(test).ts'],
  coverageDirectory: 'coverage/e2e',
  collectCoverageFrom: ['modules/test/**/*.ts', '!modules/test/**/*.test.ts'],
  coverageProvider: 'v8',
  clearMocks: true,
  maxWorkers: 1,
};
