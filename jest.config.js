/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/amplify/'
  ],
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    // Use babel-jest for JS/JSX/TS/TSX files
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@aws-amplify|aws-amplify|@2toad/profanity)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.js',
    '!**/amplify/**',
  ],
  testTimeout: 10000, // Increase test timeout to 10 seconds
};

module.exports = config; 