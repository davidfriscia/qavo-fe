import { fieldErrorsByName, isProblemDetails } from './problem-details';

describe('Problem Details helpers', () => {
  it('identifies RFC 9457 bodies by their canonical members', () => {
    expect(isProblemDetails({ title: 'x' })).toBe(true);
    expect(isProblemDetails({ status: 400 })).toBe(true);
    expect(isProblemDetails({ unrelated: 'value' })).toBe(false);
    expect(isProblemDetails(null)).toBe(false);
    expect(isProblemDetails('string')).toBe(false);
  });

  it('groups field errors by field name', () => {
    const grouped = fieldErrorsByName({
      errors: [
        { field: 'email', message: 'required' },
        { field: 'email', message: 'invalid' },
        { field: 'name', message: 'required' },
      ],
    });
    expect(grouped['email']).toHaveLength(2);
    expect(grouped['name']).toHaveLength(1);
  });

  it('returns an empty map for a problem without field errors', () => {
    expect(fieldErrorsByName({ title: 'x' })).toEqual({});
  });
});
