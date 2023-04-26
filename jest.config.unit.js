module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  coverageDirectory: 'coverage/unit',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts'],
  coverageProvider: 'v8',
  clearMocks: true,
  maxWorkers: 1,
};
