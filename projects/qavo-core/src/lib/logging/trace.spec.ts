import { buildTraceparent, generateSpanId, generateTraceId } from './trace';

describe('trace correlation primitives', () => {
  it('generates a 32-char lowercase hex trace id', () => {
    const id = generateTraceId();
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });

  it('generates a 16-char lowercase hex span id', () => {
    expect(generateSpanId()).toMatch(/^[0-9a-f]{16}$/);
  });

  it('builds a W3C-shaped traceparent value', () => {
    const traceId = '0af7651916cd43dd8448eb211c80319c';
    const spanId = 'b7ad6b7169203331';
    expect(buildTraceparent(traceId, spanId)).toBe(`00-${traceId}-${spanId}-01`);
  });

  it('mints distinct trace ids across invocations', () => {
    expect(generateTraceId()).not.toBe(generateTraceId());
  });
});
