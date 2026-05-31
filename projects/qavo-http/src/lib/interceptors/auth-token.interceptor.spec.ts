import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@qavo/core';
import { authTokenInterceptor } from './auth-token.interceptor';

class StubAuth {
  constructor(private token: string | null) {}
  getAccessToken(): string | null {
    return this.token;
  }
}

describe('authTokenInterceptor', () => {
  function setup(token: string | null): { http: HttpClient; ctrl: HttpTestingController } {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: new StubAuth(token) },
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    return { http: TestBed.inject(HttpClient), ctrl: TestBed.inject(HttpTestingController) };
  }

  it('attaches a Bearer header when a token is available', () => {
    const { http, ctrl } = setup('abc.def.ghi');
    http.get('/x').subscribe();
    const req = ctrl.expectOne('/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
    req.flush({});
  });

  it('does not overwrite a caller-supplied Authorization header', () => {
    const { http, ctrl } = setup('platform-token');
    http.get('/x', { headers: { Authorization: 'Bearer override' } }).subscribe();
    const req = ctrl.expectOne('/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer override');
    req.flush({});
  });

  it('is a no-op when no token is available', () => {
    const { http, ctrl } = setup(null);
    http.get('/x').subscribe();
    const req = ctrl.expectOne('/x');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
