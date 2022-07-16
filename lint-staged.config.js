module.exports = {
  '!(*test).{js,ts}': ['prettier --write', 'eslint --fix'],
  '*.{vue}': ['prettier --write', 'eslint --fix'],
  '*.{css,scss}': ['prettier --write'],
  '*.{html,json,md,yml}': ['prettier --write']
};
