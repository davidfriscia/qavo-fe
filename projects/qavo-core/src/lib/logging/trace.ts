import { Injectable } from '@angular/core';

/** W3C `traceparent` header name, used for end-to-end trace propagation. */
export const TRACEPARENT_HEADER = 'traceparent';

function randomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.getRandomValues) {
    cryptoObj.getRandomValues(array);
  } else {
    for (let i = 0; i < bytes; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Generate a 16-byte (32 hex char) W3C trace id. */
export function generateTraceId(): string {
  return randomHex(16);
}

/** Generate an 8-byte (16 hex char) W3C span id. */
export function generateSpanId(): string {
  return randomHex(8);
}

/** Build a W3C `traceparent` value (`version-traceId-spanId-flags`). */
export function buildTraceparent(traceId: string, spanId = generateSpanId()): string {
  return `00-${traceId}-${spanId}-01`;
}

/**
 * Issues and tracks correlation ids.
 *
 * The HTTP layer uses this to stamp every outbound request with a `traceparent`
 * header, and the error/logging layers reuse the same id so a single user action
 * is traceable end to end — frontend logs, backend logs, and the `traceId` in a
 * Problem Details response all line up.
 */
@Injectable({ providedIn: 'root' })
export class CorrelationService {
  /** Mint a fresh trace id for a new logical operation/request. */
  newTraceId(): string {
    return generateTraceId();
  }

  newTraceparent(traceId = this.newTraceId()): string {
    return buildTraceparent(traceId);
  }
}
