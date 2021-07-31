module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFiles: ['./tests/unit/setupTest.js'],
  transform: {
    '^.+\\.vue$': 'vue-jest'
  }
};
