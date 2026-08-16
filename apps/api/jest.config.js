module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@factories/(.*)$': '<rootDir>/test/factories/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!\\.pnpm/(uuid@|@faker-js\\+faker@)|uuid/|@faker-js/faker/)',
  ],
  collectCoverageFrom: ['src/modules/**/domain/**/*.ts', 'src/modules/**/application/**/*.ts'],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
  },
};
