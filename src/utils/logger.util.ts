declare global {
  interface Window {
    logger: LoggerInstance;
  }
}

export type LoggerLevelKey = keyof typeof LogLevel;
export type LoggerRemoteOptions = {
  logLevel: LogLevel;
  handler: (...args: any[]) => void;
};
export type LoggerOptions = {
  remote?: LoggerRemoteOptions;
  logLevel?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
};
export type LoggerInstance = typeof Logger;

export const COLORS = {
  DEBUG: { COLOR: '#ffffff', BG: '#616161', BORDER: '#424242' },
  ERROR: { COLOR: '#ffffff', BG: '#d32f2f', BORDER: '#c62828' },
  GROUP: { COLOR: '#ffffff', BG: '#546e7a', BORDER: '#455a64' },
  INFO: { COLOR: '#ffffff', BG: '#1976d2', BORDER: '#1565c0' },
  SUCCESS: { COLOR: '#ffffff', BG: '#689f38', BORDER: '#558b2f' },
  TRACE: { COLOR: '#ffffff', BG: '#d81b60', BORDER: '#c2185b' },
  TIME: { COLOR: '#ffffff', BG: '#0097a7', BORDER: '#00838f' },
  WARN: { COLOR: '#ffffff', BG: '#ffb300', BORDER: '#ffa000' },
  PREFIX: { COLOR: '#000000', BG: '#fafafa', BORDER: '#c7c7c7' },
  PREFIX_DM: { COLOR: '#ffffff', BG: '#424242', BORDER: '#212121' }
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

const state: Required<LoggerOptions> = Object.seal({
  logLevel: import.meta.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  prefix: '',
  remote: {} as LoggerRemoteOptions,
  timestamp: false
});

const getTimestamp = (): string => new Date().toISOString().split('T')[1].substr(0, 12);

const print = (level: LoggerLevelKey, color: keyof typeof COLORS, ...args: any[]) => {
  const { logLevel, prefix, remote, timestamp } = state;
  const type = (['DEBUG', 'SUCCESS'].includes(level) ? 'log' : level.toLowerCase()) as keyof Console;

  if (logLevel > LogLevel[level]) return;

  const stdout: any[] = [
    `%c${level}%c`,
    `background: ${COLORS[color].BG}; color: ${COLORS[color].COLOR};
     border: 1px solid ${COLORS[color].BORDER}; border-radius: 4px; font-weight: bold;
     padding: 0 3px; margin-right: ${timestamp || prefix ? '6px' : '0'};`
  ];

  if (prefix) {
    const colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'PREFIX_DM' : 'PREFIX';
    stdout[0] = `${stdout[0]}${prefix}%c`;
    stdout.push(
      `background: ${COLORS[colorMode].BG}; color: ${COLORS[colorMode].COLOR}; border-radius: 8px;
       padding: 0 3px; margin-right: ${timestamp ? '6px' : '0'}; margin-top: 2px; font: italic small-caps bold 12px;`
    );
  }

  if (timestamp) {
    stdout[0] = `${stdout[0]}${getTimestamp()}%c`;
    stdout.push('color: gray;');
  }

  stdout.push('color: inherit;', ...args);
  (console[type].apply as any)(null, stdout);

  if (remote.handler) {
    if (remote.logLevel > LogLevel[level]) return;
    remote.handler(level, ...args);
  }
};

export const Logger = {
  initialise(options: LoggerOptions): void {
    Object.assign(state, options);
  },
  getLevel(): LogLevel {
    return state.logLevel;
  },
  getTimestamp(): boolean {
    return state.timestamp;
  },
  setLogLevel(level: LogLevel | keyof typeof LogLevel): void {
    state.logLevel = typeof level === 'string' ? LogLevel[level.toUpperCase() as keyof typeof LogLevel] : level;
  },
  setPrefix(prefix: string): void {
    state.prefix = prefix;
  },
  setRemote(remote: LoggerRemoteOptions): void {
    state.remote = remote;
  },
  setRemoteLogLevel(level: LogLevel | keyof typeof LogLevel): void {
    state.remote.logLevel = typeof level === 'string' ? LogLevel[level.toUpperCase() as keyof typeof LogLevel] : level;
  },
  setTimestamp(enabled: boolean): void {
    state.timestamp = enabled;
  },
  trace(...args: any[]): void {
    print('TRACE', 'TRACE', ...args);
  },
  time(...args: any[]): void {
    if (state.logLevel > LogLevel.TIME) return;
    print('TIME', 'TIME', ...args);
  },
  timeEnd(): void {
    if (state.logLevel > LogLevel.TIME) return;
    console.timeEnd();
  },
  table(...args: any[]): void {
    if (state.logLevel > LogLevel.TABLE) return;
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
    const { logLevel, prefix, timestamp } = state;

    if (logLevel > LogLevel.SUCCESS) return;

    const elapsed = Math.floor(Date.now() - time);
    const colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'PREFIX_DM' : 'PREFIX';

    console.groupCollapsed(
      `%c${label}%c${prefix ? `${prefix}` : ''}%c${timestamp ? `${getTimestamp()}` : ''}%c${text} %c${
        elapsed ? `${elapsed}ms` : ''
      } `,
      `background: ${COLORS.GROUP.BG}; color: ${COLORS.GROUP.COLOR}; border: 1px solid ${COLORS.GROUP.BORDER}; border-radius: 4px; padding: 0 3px; margin-right: 6px; font-weight: bold;`,
      `background: ${COLORS[colorMode].BG}; color: ${COLORS[colorMode].COLOR}; border-radius: 8px; padding: 0 3px; margin-right: 6px; margin-top: 2px; font: italic small-caps bold 12px; font-weight: lighter;`,
      'color: gray; font-weight: lighter; margin-right: 6px;',
      'color: inherit;',
      'color: gray; font-weight: lighter;'
    );
  },
  groupEnd(): void {
    if (state.logLevel > LogLevel.SUCCESS) return;
    console.groupEnd();
  }
};

window.logger = Logger;
