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

type LogLevelKey = keyof typeof LogLevel;

let _logLevel = process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG;
let _timestamp = false;
let _prefix = '';

const getTimestamp = (): string => new Date().toISOString().split('T')[1].substr(0, 12);

const print = (level: LogLevelKey, color: keyof typeof COLORS, ...args: any[]) => {
  if (_logLevel > LogLevel[level]) return;
  const type = (
    (['DEBUG', 'SUCCESS'] as LogLevelKey[]).some(t => LogLevel[level] === LogLevel[t]) ? 'log' : level.toLowerCase()
  ) as keyof Console;

  const stdout = [
    `%c${level}%c`,
    `background: ${COLORS[color].BG}; color: ${COLORS[color].COLOR};
     border: 1px solid ${COLORS[color].BORDER}; border-radius: 4px; font-weight: bold;
     padding: 0 3px; margin-right: ${_timestamp || _prefix ? '6px' : '0'};`
  ];

  if (_prefix) {
    const colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'PREFIX_DM' : 'PREFIX';
    stdout[0] = `${stdout[0]}${_prefix}%c`;
    stdout.push(
      `background: ${COLORS[colorMode].BG}; color: ${COLORS[colorMode].COLOR}; border-radius: 8px;
       padding: 0 3px; margin-right: ${_timestamp ? '6px' : '0'}; margin-top: 2px; font: italic small-caps bold 12px;`
    );
  }

  if (_timestamp) {
    stdout[0] = `${stdout[0]}${getTimestamp()}%c`;
    stdout.push('color: gray;');
  }

  stdout.push('color: inherit;', ...args);
  console[type](...stdout);
};

export const Logger = {
  getLevel(): LogLevel {
    return _logLevel;
  },
  setLogLevel(level: LogLevel | keyof typeof LogLevel): void {
    _logLevel = typeof level === 'string' ? LogLevel[level.toUpperCase() as keyof typeof LogLevel] : level;
  },
  getTimestamp(): boolean {
    return _timestamp;
  },
  setTimestamp(enabled: boolean): void {
    _timestamp = enabled;
  },
  setPrefix(prefix: string): void {
    _prefix = prefix;
  },
  trace(...args: any[]): void {
    print('TRACE', 'TRACE', ...args);
  },
  time(...args: any[]): void {
    if (_logLevel > LogLevel.TIME) return;
    print('TIME', 'TIME', ...args);
  },
  timeEnd(): void {
    if (_logLevel > LogLevel.TIME) return;
    console.timeEnd();
  },
  table(...args: any[]): void {
    if (_logLevel > LogLevel.TABLE) return;
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
    if (_logLevel > LogLevel.SUCCESS) return;
    const elapsed = Math.floor(Date.now() - time);
    const colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'PREFIX_DM' : 'PREFIX';
    console.groupCollapsed(
      `%c${label}%c${_prefix ? `${_prefix}` : ''}%c${_timestamp ? `${getTimestamp()}` : ''}%c${text} %c${
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
    if (_logLevel > LogLevel.SUCCESS) return;
    console.groupEnd();
  }
};

export type ILogger = typeof Logger;

window.logger = Logger;
