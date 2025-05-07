
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Use 'node' for backend/data tests, 'jsdom' for component tests
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/src/app/auth/" // Ignoring auth folder for now
  ],
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Uncomment if you create jest.setup.js
};
