import { LoggerService } from '@nestjs/common';
import * as log4js from 'log4js';

export enum LOG_LEVEL {
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

export class Logger implements LoggerService {
  private readonly logger: log4js.Logger;

  constructor(name: string, level: LOG_LEVEL) {
    this.logger = log4js.getLogger(name);
    this.logger.level = level;
  }

  /**
   * Write a 'log' level log.
   */
  log(...args: [message: any, ...optionalParams: any[]]) {
    this.logger.info(...args);
  }

  /**
   * Write an 'error' level log.
   */
  error(...args: [message: any, ...optionalParams: any[]]) {
    this.logger.error(...args);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(...args: [message: any, ...optionalParams: any[]]) {
    this.logger.warn(...args);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(...args: [message: any, ...optionalParams: any[]]) {
    this.logger.debug(...args);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?() {
    throw new Error('Verbose method not implemented. Please use \'log\' instead.');
  }
}
