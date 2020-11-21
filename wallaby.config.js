// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = wallaby => {
  process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true;

  return {
    files: ['src/**/*', '!src/**/__tests__/**/*.ts', 'jest.config.js', 'package.json', 'tsconfig.json'],

    tests: ['src/**/__tests__/**/*.ts'],

    env: {
      type: 'node',
      runner: 'node'
    },

    preprocessors: {
      '**/*.js?(x)': file =>
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('@babel/core').transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          plugins: ['babel-plugin-jest-hoist']
        })
    },

    setup(wallaby) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const jestConfig = require('./package').jest || require('./jest.config');
      delete jestConfig.transform['^.+\\.tsx?$'];
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest',

    debug: true
  };
};
