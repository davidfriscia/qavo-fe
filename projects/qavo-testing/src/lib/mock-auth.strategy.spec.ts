import { MockAuthStrategy } from './mock-auth.strategy';
import { createTestSession } from './fixtures';
import { firstValueFrom } from 'rxjs';

describe('MockAuthStrategy', () => {
  it('restores the seeded session', async () => {
    const seeded = createTestSession({ permissions: ['admin'] });
    const strategy = new MockAuthStrategy(seeded);
    await expect(firstValueFrom(strategy.restore())).resolves.toBe(seeded);
    expect(strategy.getAccessToken()).toBe(seeded.accessToken);
  });

  it('produces a default test session on login when none was seeded', async () => {
    const strategy = new MockAuthStrategy();
    const result = await firstValueFrom(strategy.login({ username: 'u', password: 'p' }));
    expect(result.user.id).toBeTruthy();
  });

  it('clears the session on logout', async () => {
    const strategy = new MockAuthStrategy(createTestSession());
    await firstValueFrom(strategy.logout());
    await expect(firstValueFrom(strategy.restore())).resolves.toBeNull();
    expect(strategy.getAccessToken()).toBeNull();
  });
});
