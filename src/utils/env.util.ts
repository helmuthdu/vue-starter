export function isDev() {
  return import.meta?.env?.NODE_ENV === 'development';
}
