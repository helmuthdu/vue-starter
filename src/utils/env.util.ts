export function isDev() {
  return import.meta?.env?.NODE_ENV === 'development';
}

export function isProd() {
  return import.meta?.env?.NODE_ENV === 'production';
}
