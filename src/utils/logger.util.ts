export enum LogColors {
  GROUP = '#EC407A',
  TRACE = '#00BCD4',
  TIME = '#9C27B0',
  DEBUG = '#9E9E9E',
  INFO = '#2196F3',
  SUCCESS = '#8BC34A',
  WARN = '#FFC107',
  ERROR = '#F44336'
}

export enum LogLevel {
  TRACE,
  TIME,
  TABLE,
  DEBUG,
  INFO,
  SUCCESS,
  WARN,
  ERROR,
  OFF
}

type LogLevelKey = keyof typeof LogLevel;

let logLevel = process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.TRACE;

let timestamp = false;

const getTimestamp = (): string => new Date().toISOString().split('T')[1].substr(0, 12);

const print = (level: LogLevelKey, color: string, ...args: any[]) => {
  if (logLevel > LogLevel[level]) return;
  const type = (
    (['DEBUG', 'SUCCESS'] as LogLevelKey[]).some(t => LogLevel[level] === LogLevel[t]) ? 'log' : level.toLowerCase()
  ) as keyof Console;
  if (timestamp) {
    console[type](`%c[${level}]%c ${getTimestamp()}%c`, `color: ${color};`, 'color: gray;', 'color: inherit;', ...args);
  } else {
    console[type](`%c[${level}]%c`, `color: ${color};`, 'color: inherit;', ...args);
  }
};

export const Logger = {
  getLevel(): LogLevel {
    return logLevel;
  },
  setLogLevel(level: LogLevel): void {
    logLevel = level;
  },
  getTimestamp(): boolean {
    return timestamp;
  },
  setTimestamp(enable: boolean): void {
    timestamp = enable;
  },
  trace(...args: any[]): void {
    print('TRACE', LogColors.TRACE, ...args);
  },
  time(...args: any[]): void {
    if (logLevel > LogLevel.DEBUG) return;
    print('TIME', LogColors.TIME, ...args);
  },
  timeEnd(): void {
    if (logLevel > LogLevel.DEBUG) return;
    console.timeEnd();
  },
  table(...args: any[]): void {
    if (logLevel > LogLevel.TABLE) return;
    console.table(...args);
  },
  debug(...args: any[]): void {
    print('DEBUG', LogColors.DEBUG, ...args);
  },
  info(...args: any[]): void {
    print('INFO', LogColors.INFO, ...args);
  },
  success(...args: any[]): void {
    print('SUCCESS', LogColors.SUCCESS, ...args);
  },
  warn(...args: any[]): void {
    print('WARN', LogColors.WARN, ...args);
  },
  error(...args: any[]): void {
    print('ERROR', LogColors.ERROR, ...args);
  },
  groupCollapsed(text: string, label = 'GROUP', time: number = Date.now()): void {
    if (logLevel > LogLevel.DEBUG) return;
    const elapsed = Math.floor(Date.now() - time);
    console.groupCollapsed(
      `%c[${label}] %c${timestamp ? `${getTimestamp()} ` : ''}%c${text} %c${elapsed ? `${elapsed}ms` : ''} `,
      `color: ${LogColors.GROUP}; font-weight: lighter;`,
      'color: gray; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;'
    );
  },
  groupEnd(): void {
    if (logLevel > LogLevel.DEBUG) return;
    console.groupEnd();
  }
};
