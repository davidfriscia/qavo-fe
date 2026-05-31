import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QavoValidators } from './validators';

describe('QavoValidators', () => {
  describe('notBlank', () => {
    const validator = QavoValidators.notBlank();
    it('flags whitespace-only non-empty values', () => {
      expect(validator({ value: '   ' } as never)).toEqual({ notBlank: true });
    });
    it('accepts empty string (defer to `required`)', () => {
      expect(validator({ value: '' } as never)).toBeNull();
    });
    it('accepts non-blank values', () => {
      expect(validator({ value: 'hi' } as never)).toBeNull();
    });
  });

  describe('strongPassword', () => {
    const validator = QavoValidators.strongPassword(10);
    it('flags missing character classes', () => {
      const result = validator({ value: 'alllowercase1' } as never);
      expect(result?.['strongPassword'].failures).toContain('uppercase');
    });
    it('flags short passwords', () => {
      const result = validator({ value: 'Aa1' } as never);
      expect(result?.['strongPassword'].failures).toContain('length');
    });
    it('accepts a compliant password', () => {
      expect(validator({ value: 'GoodPass123' } as never)).toBeNull();
    });
    it('skips validation when the control is empty (lets `required` decide)', () => {
      expect(validator({ value: '' } as never)).toBeNull();
    });
  });

  describe('matchControls', () => {
    let form: FormGroup;
    beforeEach(() => {
      form = new FormBuilder().group(
        { a: ['', Validators.required], b: ['', Validators.required] },
        { validators: QavoValidators.matchControls('a', 'b') },
      );
    });

    it('flags a mismatch on the target control', () => {
      form.setValue({ a: 'one', b: 'two' });
      expect(form.errors).toEqual({ mismatch: true });
      expect(form.get('b')!.errors?.['mismatch']).toBe(true);
    });

    it('clears a prior mismatch when the values converge', () => {
      form.setValue({ a: 'one', b: 'two' });
      form.setValue({ a: 'one', b: 'one' });
      expect(form.errors).toBeNull();
      expect(form.get('b')!.errors?.['mismatch']).toBeUndefined();
    });
  });
});
