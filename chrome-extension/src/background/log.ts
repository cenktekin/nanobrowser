/// <reference types="vite/client" />

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warning: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  setLogLevel: (level: LogLevel) => void;
}

const createLogger = (namespace: string): Logger => {
  const prefix = `[${namespace}]`;
  let currentLogLevel: LogLevel = 'info'; 

  const logInternal = (level: LogLevel, consoleMethod: (...args: any[]) => void, ...args: unknown[]) => {
    const now = new Date().toISOString();
    const logLevelsOrder: LogLevel[] = ['debug', 'info', 'warning', 'error'];
    if (logLevelsOrder.indexOf(level) >= logLevelsOrder.indexOf(currentLogLevel)) {
      consoleMethod(`${now} ${prefix}`, ...args);
    }
  };

  return {
    debug: (...args: unknown[]) => logInternal('debug', console.debug, ...args),
    info: (...args: unknown[]) => logInternal('info', console.info, ...args),
    warning: (...args: unknown[]) => logInternal('warning', console.warn, ...args),
    error: (...args: unknown[]) => logInternal('error', console.error, ...args),
    group: (label: string) => {
      const now = new Date().toISOString();
      const logLevelsOrder: LogLevel[] = ['debug', 'info', 'warning', 'error'];
      if (logLevelsOrder.indexOf(currentLogLevel) <= logLevelsOrder.indexOf('debug') && console.group) { // Sadece debug seviyesinde veya daha düşükse ve console.group varsa grupla
         console.group(`${now} ${prefix} ${label}`);
      } else {
        // Grup desteklenmiyorsa veya log seviyesi uygun değilse normal log at
        let consoleMethodForGroupFallback = console.log;
        if (currentLogLevel === 'debug') consoleMethodForGroupFallback = console.debug;
        else if (currentLogLevel === 'info') consoleMethodForGroupFallback = console.info;
        else if (currentLogLevel === 'warning') consoleMethodForGroupFallback = console.warn;
        else if (currentLogLevel === 'error') consoleMethodForGroupFallback = console.error;
        consoleMethodForGroupFallback(`${now} ${prefix} ${label} (group start)`);
      }
    },
    groupEnd: () => {
      const logLevelsOrder: LogLevel[] = ['debug', 'info', 'warning', 'error'];
      if (logLevelsOrder.indexOf(currentLogLevel) <= logLevelsOrder.indexOf('debug') && console.groupEnd) {
         console.groupEnd();
      }
    },
    setLogLevel: (level: LogLevel) => {
      currentLogLevel = level;
      const now = new Date().toISOString();
      console.info(`${now} ${prefix}`, `Log level set to ${level}`);
    },
  };
};

// Create default logger
const logger = createLogger('Agent');

export type { Logger, LogLevel };
export { createLogger, logger };
