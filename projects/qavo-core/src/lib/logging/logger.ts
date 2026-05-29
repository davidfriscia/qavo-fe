import { InjectionToken, inject } from '@angular/core';
import { Injectable } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

export interface LogEntry {
  level: LogLevel;
  message: string;
  /** Structured context merged into the entry (kept JSON-serializable). */
  context?: Record<string, unknown>;
  traceId?: string;
  timestamp: string;
}

/** A pluggable destination for structured log entries. */
export interface LogSink {
  write(entry: LogEntry): void;
}

export interface QavoLoggingConfig {
  /** Minimum level emitted. Defaults to `info` in production, `debug` otherwise. */
  minLevel: LogLevel;
  /** Application name stamped on every entry (mirrors backend MDC `appName`). */
  appName: string;
  /** Optional backend endpoint that unhandled errors are forwarded to. */
  remoteEndpoint?: string;
}

export const QAVO_LOGGING_CONFIG = new InjectionToken<QavoLoggingConfig>('QAVO_LOGGING_CONFIG');
export const QAVO_LOG_SINKS = new InjectionToken<LogSink[]>('QAVO_LOG_SINKS');

/** Console sink with severity-appropriate output. Always registered. */
export class ConsoleLogSink implements LogSink {
  write(entry: LogEntry): void {
    const payload = { ...entry.context, traceId: entry.traceId };
    switch (entry.level) {
      case 'error':
        console.error(entry.message, payload);
        break;
      case 'warn':
        console.warn(entry.message, payload);
        break;
      case 'debug':
        console.debug(entry.message, payload);
        break;
      default:
        console.info(entry.message, payload);
    }
  }
}

/**
 * Structured frontend logger.
 *
 * Mirrors the backend's enforced structured-logging contract: every entry
 * carries the application name and (when available) a `traceId`, so frontend and
 * backend logs correlate. Entries fan out to all registered {@link LogSink}s.
 */
@Injectable({ providedIn: 'root' })
export class QavoLogger {
  private readonly config = inject(QAVO_LOGGING_CONFIG);
  private readonly sinks = inject(QAVO_LOG_SINKS);

  debug(message: string, context?: Record<string, unknown>, traceId?: string): void {
    this.log('debug', message, context, traceId);
  }
  info(message: string, context?: Record<string, unknown>, traceId?: string): void {
    this.log('info', message, context, traceId);
  }
  warn(message: string, context?: Record<string, unknown>, traceId?: string): void {
    this.log('warn', message, context, traceId);
  }
  error(message: string, context?: Record<string, unknown>, traceId?: string): void {
    this.log('error', message, context, traceId);
  }

  private log(
    level: LogLevel,
    message: string,
    context: Record<string, unknown> = {},
    traceId?: string,
  ): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.config.minLevel]) {
      return;
    }
    const entry: LogEntry = {
      level,
      message,
      traceId,
      timestamp: new Date().toISOString(),
      context: { appName: this.config.appName, ...context },
    };
    for (const sink of this.sinks) {
      try {
        sink.write(entry);
      } catch {
        // A failing sink must never break application flow.
      }
    }
  }
}
