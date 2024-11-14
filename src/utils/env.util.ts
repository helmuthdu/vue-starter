export function isDev() {
  return (import.meta?.env ?? process.env)?.NODE_ENV === 'development';
}
