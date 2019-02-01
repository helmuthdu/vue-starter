module.exports = wallaby => {
  return {
    files: ['src/**/*', '!src/**/__tests__/**/*.js', 'jest.config.js', 'package.json', 'tsconfig.json'],

    tests: ['src/**/__tests__/**/*.js'],

    env: {
      type: 'node',
      runner: 'node',
    },

    preprocessors: {
      '**/*.js?(x)': file =>
        require('babel-core').transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          plugins: ['transform-es2015-modules-commonjs'],
        }),
    },

    setup(wallaby) {
      const jestConfig = require('./package').jest || require('./jest.config');
      delete jestConfig.transform['^.+\\.tsx?$'];
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest',

    debug: true,
  };
};
