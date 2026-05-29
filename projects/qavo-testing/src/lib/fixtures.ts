import { QavoSession, QavoUser } from '@qavo/core';

/** Build a deterministic test user, overriding any fields as needed. */
export function createTestUser(overrides: Partial<QavoUser> = {}): QavoUser {
  return {
    id: 'user-1',
    username: 'test.user',
    displayName: 'Test User',
    email: 'test.user@example.com',
    roles: ['user'],
    permissions: [],
    ...overrides,
  };
}

/** Build a test session wrapping a (possibly overridden) user. */
export function createTestSession(
  user: Partial<QavoUser> = {},
  overrides: Partial<QavoSession> = {},
): QavoSession {
  return {
    user: createTestUser(user),
    accessToken: 'test-token',
    expiresAt: Date.now() + 3_600_000,
    ...overrides,
  };
}
