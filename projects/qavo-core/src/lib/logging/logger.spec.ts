import { TestBed } from '@angular/core/testing';
import {
  LogEntry,
  LogSink,
  QAVO_LOGGING_CONFIG,
  QAVO_LOG_SINKS,
  QavoLogger,
} from './logger';

class RecordingSink implements LogSink {
  readonly entries: LogEntry[] = [];
  write(entry: LogEntry): void {
    this.entries.push(entry);
  }
}

describe('QavoLogger', () => {
  function setup(minLevel: 'debug' | 'info' | 'warn' | 'error'): {
    logger: QavoLogger;
    sink: RecordingSink;
  } {
    const sink = new RecordingSink();
    TestBed.configureTestingModule({
      providers: [
        { provide: QAVO_LOGGING_CONFIG, useValue: { minLevel, appName: 'test-app' } },
        { provide: QAVO_LOG_SINKS, useValue: [sink] },
      ],
    });
    return { logger: TestBed.inject(QavoLogger), sink };
  }

  it('filters out entries below the configured minimum level', () => {
    const { logger, sink } = setup('warn');
    logger.debug('debug');
    logger.info('info');
    logger.warn('warn');
    logger.error('error');
    expect(sink.entries.map((e) => e.level)).toEqual(['warn', 'error']);
  });

  it('stamps every entry with appName and propagates traceId', () => {
    const { logger, sink } = setup('debug');
    logger.info('hello', { userId: 'u1' }, 'trace-xyz');
    expect(sink.entries[0].context).toMatchObject({ appName: 'test-app', userId: 'u1' });
    expect(sink.entries[0].traceId).toBe('trace-xyz');
  });

  it('fans out to every registered sink and isolates failures', () => {
    const good = new RecordingSink();
    const bad: LogSink = {
      write() {
        throw new Error('sink down');
      },
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: QAVO_LOGGING_CONFIG, useValue: { minLevel: 'debug', appName: 'app' } },
        { provide: QAVO_LOG_SINKS, useValue: [bad, good] },
      ],
    });
    const logger = TestBed.inject(QavoLogger);
    expect(() => logger.info('still works')).not.toThrow();
    expect(good.entries).toHaveLength(1);
  });
});
