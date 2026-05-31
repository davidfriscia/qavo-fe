import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@qavo/core';
import { RecordingNotificationService } from './recording-notification.service';

describe('RecordingNotificationService', () => {
  it('records notifications instead of rendering them', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: NotificationService, useClass: RecordingNotificationService }],
    });
    const service = TestBed.inject(NotificationService) as RecordingNotificationService;
    service.notify({ severity: 'info', title: 'first' });
    service.notify({ severity: 'error', title: 'second' });
    expect(service.notifications).toHaveLength(2);
    expect(service.last?.title).toBe('second');
    service.clear();
    expect(service.notifications).toHaveLength(0);
  });
});
