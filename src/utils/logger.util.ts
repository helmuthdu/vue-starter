import { isProd } from './env.util';

declare global {
  interface Window {
    logger: LoggerInstance;
  }
}

export type LoggerType = 'debug' | 'tracer' | 'time' | 'table' | 'info' | 'success' | 'warn' | 'error';
export type LoggerInstance = typeof Logger;
export type LoggerColors = Exclude<LoggerType, 'table'> | 'group' | 'ns';
export type LoggerLevel = LoggerType | 'off';
export type LoggerRemoteOptions = {
  logLevel: LoggerLevel;
  handler?: (...args: unknown[]) => void;
};
export type LoggerOptions = {
  remote?: LoggerRemoteOptions;
  logLevel?: LoggerLevel;
  namespace?: string;
  timestamp?: boolean;
};

export const Colors: Record<LoggerColors, { color: string; bg: string; border: string }> = Object.freeze({
  debug: { color: '#ffffff', bg: '#616161', border: '#424242' },
  error: { color: '#ffffff', bg: '#d32f2f', border: '#c62828' },
  group: { color: '#ffffff', bg: '#546e7a', border: '#455a64' },
  info: { color: '#ffffff', bg: '#1976d2', border: '#1565c0' },
  success: { color: '#ffffff', bg: '#689f38', border: '#558b2f' },
  time: { color: '#ffffff', bg: '#0097a7', border: '#00838f' },
  tracer: { color: '#ffffff', bg: '#d81b60', border: '#c2185b' },
  warn: { color: '#ffffff', bg: '#ffb300', border: '#ffa000' },
  ns:
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? { color: '#000000', bg: '#fafafa', border: '#c7c7c7' }
      : { color: '#ffffff', bg: '#424242', border: '#212121' },
});

export const loggerLevel: Record<LoggerLevel, number> = Object.freeze({
  debug: 0,
  tracer: 1,
  time: 2,
  table: 3,
  info: 4,
  success: 5,
  warn: 6,
  error: 7,
  off: 8,
});

const state: Required<LoggerOptions> = Object.seal({
  logLevel: isProd() ? 'error' : 'debug',
  namespace: '',
  remote: {
    logLevel: 'off',
    handler: undefined,
  },
  timestamp: true,
});

const sendRemoteLog = (type: LoggerType, args: unknown[]) => {
  if (state.remote.handler && loggerLevel[state.remote.logLevel] <= loggerLevel[type]) {
    state.remote.handler(type, ...args);
  }
};

const shouldLog = (type: LoggerType): boolean => {
  return loggerLevel[state.logLevel] <= loggerLevel[type];
};

const getTimestamp = (): string => new Date().toISOString().split('T')[1].substring(0, 12);

const printType = (stdout: string[], type: LoggerType, margin: number) => {
  stdout.push(
    `%c${type.toUpperCase()}%c`,
    `background: ${Colors[type as LoggerColors].bg}; color: ${Colors[type as LoggerColors].color};
     border: 1px solid ${Colors[type as LoggerColors].border}; border-radius: 4px; font-weight: bold;
     padding: 0 3px; margin-right: ${margin ? `${margin}px` : '0'};`,
  );
};

const printPrefix = (stdout: string[], namespace: string, timestamp: boolean) => {
  stdout[0] = `${stdout[0]}${namespace}%c`;
  stdout.push(
    `background: ${Colors.ns.bg}; color: ${Colors.ns.color}; border-radius: 8px;
       padding: 0 3px; margin-right: ${timestamp ? '6px' : '0'}; margin-top: 2px; font: italic small-caps bold 12px;`,
  );
};

const printTimestamp = (stdout: string[]) => {
  stdout[0] = `${stdout[0]}${getTimestamp()}%c`;
  stdout.push('color: gray;');
};

const print = (type: LoggerType, ...args: unknown[]) => {
  const { namespace, timestamp } = state;

  if (!shouldLog(type)) return;

  const stdout: string[] = [];

  if (typeof window !== 'undefined') {
    printType(stdout, type, timestamp || namespace ? 6 : 0);

    if (namespace) {
      printPrefix(stdout, namespace, timestamp);
    }

    if (timestamp) {
      printTimestamp(stdout);
    }

    stdout.push('color: inherit;', ...(args as string[]));
  } else {
    stdout.push(...(args as string[]));
  }

  const _type = (['debug', 'success'].includes(type) ? 'log' : type.toLowerCase()) as keyof Console;
  (console[_type] as (...args: unknown[]) => void)(...stdout);

  sendRemoteLog(type, args);
};

export const Logger = {
  initialise(options: LoggerOptions): void {
    Object.assign(state, options);
  },
  getLevel(): Lowercase<LoggerLevel> {
    return state.logLevel;
  },
  getPrefix(): string {
    return state.namespace;
  },
  getTimestamp(): boolean {
    return state.timestamp;
  },
  setLogLevel(level: Lowercase<LoggerLevel>): void {
    state.logLevel = level;
  },
  setPrefix(namespace: string): void {
    state.namespace = namespace;
  },
  setRemote(remote: LoggerRemoteOptions): void {
    state.remote = remote;
  },
  setRemoteLogLevel(level: Lowercase<LoggerLevel>): void {
    state.remote.logLevel = level;
  },
  setTimestamp(enabled: boolean): void {
    state.timestamp = enabled;
  },
  table(...args: unknown[]): void {
    if (!shouldLog('table')) return;

    console.table(...args);
  },
  trace(...args: unknown[]): void {
    print('tracer', ...args);
  },
  debug(...args: unknown[]): void {
    print('debug', ...args);
  },
  info(...args: unknown[]): void {
    print('info', ...args);
  },
  success(...args: unknown[]): void {
    print('success', ...args);
  },
  warn(...args: unknown[]): void {
    print('warn', ...args);
  },
  error(...args: unknown[]): void {
    print('error', ...args);
  },
  time(...args: unknown[]): void {
    print('time', ...args);
  },
  timeEnd(): void {
    if (!shouldLog('time')) return;

    console.timeEnd();
  },
  groupCollapsed(text: string, label = 'GROUP', time: number = Date.now()): void {
    const { namespace, timestamp } = state;

    if (!shouldLog('success')) return;

    const elapsed = Math.floor(Date.now() - time);

    console.groupCollapsed(
      `%c${label}%c${namespace ? `${namespace}` : ''}%c${timestamp ? `${getTimestamp()}` : ''}%c${text} %c${elapsed ? `${elapsed}ms` : ''} `,
      `background: ${Colors.group.bg}; color: ${Colors.group.color}; border: 1px solid ${Colors.group.border}; border-radius: 4px; padding: 0 3px; margin-right: 6px; font-weight: bold;`,
      `background: ${Colors.ns.bg}; color: ${Colors.ns.color}; border-radius: 8px; padding: 0 3px; margin-right: 6px; margin-top: 2px; font: italic small-caps bold 12px; font-weight: lighter;`,
      'color: gray; font-weight: lighter; margin-right: 6px;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
    );
  },
  groupEnd(): void {
    if (!shouldLog('success')) return;

    console.groupEnd();
  },
};

if (typeof window !== 'undefined') {
  window.logger = Logger;
}
