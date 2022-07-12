module.exports = {
  '!(*test).{js,ts}': ['prettier --write', 'eslint --fix'],
  '*.{vue}': ['prettier --write', 'stylelint --fix', 'eslint --fix'],
  '*.{css,scss}': ['prettier --write', 'stylelint --fix'],
  '*.{html,json,md,yml}': ['prettier --write']
};
