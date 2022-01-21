const esModules = ['nanostores', '@nanostores/i18n', '@nanostores/vue'].join('|');

module.exports = {
  globals: {
    'vue-jest': {
      babelConfig: true
    }
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['./tests/unit/setupTest.js'],
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest'
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|less|s(c|a)ss)$': 'identity-obj-proxy'
  }
};
