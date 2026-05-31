import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CorrelationService, TRACEPARENT_HEADER } from '@qavo/core';
import { traceInterceptor } from './trace.interceptor';

describe('traceInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([traceInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  it('stamps a W3C-shaped traceparent on outbound requests', () => {
    TestBed.inject(HttpClient).get('/anything').subscribe();
    const req = TestBed.inject(HttpTestingController).expectOne('/anything');
    expect(req.request.headers.get(TRACEPARENT_HEADER)).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
    req.flush({});
  });

  it('honors a caller-supplied traceparent header', () => {
    const explicit = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01';
    TestBed.inject(HttpClient).get('/x', { headers: { [TRACEPARENT_HEADER]: explicit } }).subscribe();
    const req = TestBed.inject(HttpTestingController).expectOne('/x');
    expect(req.request.headers.get(TRACEPARENT_HEADER)).toBe(explicit);
    req.flush({});
  });

  it('produces a different traceparent per request', () => {
    const http = TestBed.inject(HttpClient);
    http.get('/one').subscribe();
    http.get('/two').subscribe();
    const ctrl = TestBed.inject(HttpTestingController);
    const a = ctrl.expectOne('/one').request.headers.get(TRACEPARENT_HEADER);
    const b = ctrl.expectOne('/two').request.headers.get(TRACEPARENT_HEADER);
    expect(a).not.toBe(b);
    // Reachable: ensures CorrelationService is wired by default.
    expect(TestBed.inject(CorrelationService)).toBeDefined();
  });
});
