/* eslint-disable @typescript-eslint/no-var-requires */
const plugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-preset-env')({ stage: 1 }),
  require('tailwindcss')
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(require('cssnano'));
}

module.exports = {
  plugins
};
