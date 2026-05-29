import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideQavoTheming } from '@qavo/theming';
import { provideQavoTesting } from '@qavo/testing';
import { QavoLoginComponent } from './login.component';

/**
 * Plugin testing example. The platform harness provides the auth strategy and
 * notification recorder; the component renders and validates with no backend.
 */
describe('QavoLoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QavoLoginComponent],
      providers: [provideQavoTesting(), provideQavoTheming({ persistence: 'none' }), provideRouter([])],
    }).compileComponents();
  });

  it('shows required-field errors when submitted empty', async () => {
    const fixture = TestBed.createComponent(QavoLoginComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as unknown as { submit: () => void; form: { invalid: boolean } };
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.invalid).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Sign in');
  });
});
