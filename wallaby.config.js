// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (wallaby) => {
  process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true;

  return {
    autoDetect: true,
    files: ['src/**/*', '!src/**/__tests__/**/*.ts', 'jest.config.js', 'package.json', 'tsconfig.json'],
    tests: ['src/**/__tests__/**/*.ts'],
    env: {
      type: 'node',
      runner: 'node',
    },
    testFramework: 'vitest',
    debug: true,
  };
};
