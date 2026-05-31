import { HttpClient, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { QAVO_API_BASE_URL } from '@qavo/core';
import { baseUrlInterceptor } from './base-url.interceptor';

/**
 * The base-URL interceptor centralizes the API version segment. The contract:
 * absolute URLs pass through; already-prefixed URLs pass through; everything
 * else is prefixed exactly once. These cases are exercised end-to-end against
 * the HTTP testing backend so the cloned request is observed as the network
 * would see it.
 */
describe('baseUrlInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: QAVO_API_BASE_URL, useValue: '/api/v1' },
        provideHttpClient(withInterceptors([baseUrlInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('prefixes a relative path with the configured base URL', () => {
    http.get('users').subscribe();
    backend.expectOne('/api/v1/users').flush({});
  });

  it('normalizes a leading slash without double-prefixing', () => {
    http.get('/orders/42').subscribe();
    backend.expectOne('/api/v1/orders/42').flush({});
  });

  it('leaves absolute URLs untouched', () => {
    http.get('https://idp.example.com/.well-known/openid-configuration').subscribe();
    backend.expectOne('https://idp.example.com/.well-known/openid-configuration').flush({});
  });

  it('does not re-prefix a URL that already starts with the base', () => {
    http.get('/api/v1/already-prefixed').subscribe();
    backend.expectOne('/api/v1/already-prefixed').flush({});
  });

  it('is a no-op when no base URL is configured', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([baseUrlInterceptor])), provideHttpClientTesting()],
    });
    const client = TestBed.inject(HttpClient);
    const ctrl = TestBed.inject(HttpTestingController);
    client.get('users').subscribe();
    ctrl.expectOne('users').flush({});
    ctrl.verify();
  });
});
