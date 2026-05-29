import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideQavoTheming } from '@qavo/theming';
import { provideQavoTesting, createTestSession } from '@qavo/testing';
import { App } from './app';
import { routes } from './app.routes';

/**
 * Example component test using the platform's testing harness: one
 * `provideQavoTesting` call supplies the auth strategy, notification recorder and
 * platform tokens; `provideQavoTheming` makes the theme toggle work.
 */
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideQavoTesting({ session: createTestSession({ permissions: ['reports:manage'] }) }),
        provideQavoTheming({ persistence: 'none' }),
        provideRouter(routes),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the brand in the shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Qavo');
  });
});
