export const COLORS = {
  DEBUG: { COLOR: '#e3f2fd', BG: '#616161', BORDER: '#424242' },
  ERROR: { COLOR: '#ffebee', BG: '#d32f2f', BORDER: '#c62828' },
  GROUP: { COLOR: '#eceff1', BG: '#546e7a', BORDER: '#455a64' },
  INFO: { COLOR: '#bbdefb', BG: '#1976d2', BORDER: '#1565c0' },
  SUCCESS: { COLOR: '#f1f8e9', BG: '#689f38', BORDER: '#558b2f' },
  TIME: { COLOR: '#fce4ec', BG: '#d81b60', BORDER: '#c2185b' },
  TRACE: { COLOR: '#e0f7fa', BG: '#0097a7', BORDER: '#00838f' },
  WARN: { COLOR: '#fff8e1', BG: '#ffb300', BORDER: '#ffa000' }
};

export enum LogLevel {
  DEBUG,
  TRACE,
  TIME,
  TABLE,
  INFO,
  SUCCESS,
  WARN,
  ERROR,
  OFF
}

type LogLevelKey = keyof typeof LogLevel;

let logLevel = process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG;

let timestamp = false;

const getTimestamp = (): string => new Date().toISOString().split('T')[1].substr(0, 12);

const print = (level: LogLevelKey, color: keyof typeof COLORS, ...args: any[]) => {
  if (logLevel > LogLevel[level]) return;
  const type = (
    (['DEBUG', 'SUCCESS'] as LogLevelKey[]).some(t => LogLevel[level] === LogLevel[t]) ? 'log' : level.toLowerCase()
  ) as keyof Console;
  if (timestamp) {
    console[type](
      `%c${level}%c ${getTimestamp()}%c`,
      `background: ${COLORS[color].BG}; color: ${COLORS[color].COLOR}; border: 1px solid ${COLORS[color].BORDER}; border-radius: 3px; padding: 0 3px; font-weight: bold;`,
      'color: gray;',
      'color: inherit;',
      ...args
    );
  } else {
    console[type](
      `%c${level}%c`,
      `background: ${COLORS[color].BG}; color: ${COLORS[color].COLOR}; border: 1px solid ${COLORS[color].BORDER}; border-radius: 3px; padding: 0 3px; font-weight: bold;`,
      'color: inherit;',
      ...args
    );
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
  setTimestamp(enabled: boolean): void {
    timestamp = enabled;
  },
  trace(...args: any[]): void {
    print('TRACE', 'TRACE', ...args);
  },
  time(...args: any[]): void {
    if (logLevel > LogLevel.DEBUG) return;
    print('TIME', 'TIME', ...args);
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
    print('DEBUG', 'DEBUG', ...args);
  },
  info(...args: any[]): void {
    print('INFO', 'INFO', ...args);
  },
  success(...args: any[]): void {
    print('SUCCESS', 'SUCCESS', ...args);
  },
  warn(...args: any[]): void {
    print('WARN', 'WARN', ...args);
  },
  error(...args: any[]): void {
    print('ERROR', 'ERROR', ...args);
  },
  groupCollapsed(text: string, label = 'GROUP', time: number = Date.now()): void {
    if (logLevel > LogLevel.DEBUG) return;
    const elapsed = Math.floor(Date.now() - time);
    console.groupCollapsed(
      `%c${label}%c${timestamp ? ` ${getTimestamp()} ` : ''}%c ${text} %c${elapsed ? `${elapsed}ms` : ''} `,
      `background: ${COLORS.GROUP.BG}; color: ${COLORS.GROUP.COLOR}; border: 1px solid ${COLORS.GROUP.BORDER}; border-radius: 3px; padding: 0 3px; font-weight: bolder;`,
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
