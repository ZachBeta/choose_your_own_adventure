import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../server.log');

function formatMessage(level: string, message: any, ...args: any[]): string {
  const timestamp = new Date().toISOString();
  let msg = '';
  if (typeof message === 'object') {
    msg = JSON.stringify(message, null, 2);
  } else {
    msg = String(message);
  }
  if (args.length) {
    msg += ' ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
  }
  return `[${timestamp}] [${level}] ${msg}`;
}

function writeLog(formatted: string, toConsole: boolean = false) {
  fs.appendFileSync(logFilePath, formatted + '\n', { encoding: 'utf8' });
  if (toConsole) {
    console.error(formatted);
  }
}

export function logInfo(message: any, ...args: any[]) {
  writeLog(formatMessage('INFO', message, ...args), false);
}

export function logError(message: any, ...args: any[]) {
  writeLog(formatMessage('ERROR', message, ...args), true);
}

export function logDebug(message: any, ...args: any[]) {
  writeLog(formatMessage('DEBUG', message, ...args), false);
}

