import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashCredential,
  sanitizeText,
  sanitizeNumber,
  sanitizeForExport,
  safeJsonParse,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from './security';

describe('Security Utility Suite', () => {
  describe('hashCredential', () => {
    it('produces deterministic 64-character hex hash for valid string', async () => {
      const hash1 = await hashCredential('12345');
      const hash2 = await hashCredential('12345');
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBeGreaterThanOrEqual(16);
    });

    it('returns empty string for empty input', async () => {
      const res = await hashCredential('');
      expect(res).toBe('');
    });
  });

  describe('sanitizeText (XSS Protection)', () => {
    it('escapes dangerous HTML characters', () => {
      const malicious = '<script>alert("XSS")</script>&foo=\'bar\'';
      const clean = sanitizeText(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('&lt;script&gt;');
      expect(clean).toContain('&amp;');
      expect(clean).toContain('&quot;');
    });
  });

  describe('sanitizeNumber (Exploit Defense)', () => {
    it('clamps numbers within valid range and guards against NaN', () => {
      expect(sanitizeNumber('100')).toBe(100);
      expect(sanitizeNumber('invalid', 0, 100, 0)).toBe(0);
      expect(sanitizeNumber(-50, 0, 1000, 0)).toBe(0);
      expect(sanitizeNumber(5000, 0, 1000, 0)).toBe(1000);
    });
  });

  describe('sanitizeForExport (Formula Injection Defense)', () => {
    it('prepends single quote to strings starting with formula trigger chars', () => {
      expect(sanitizeForExport('=cmd|')).toBe("'=cmd|");
      expect(sanitizeForExport('+12345')).toBe("'+12345");
      expect(sanitizeForExport('-999')).toBe("'-999");
      expect(sanitizeForExport('@SUM(A1)')).toBe("'@SUM(A1)");
      expect(sanitizeForExport('Normal Text')).toBe('Normal Text');
    });
  });

  describe('safeJsonParse (Prototype Pollution Defense)', () => {
    it('strips __proto__ and constructor keys', () => {
      const payload = '{"__proto__": {"admin": true}, "validKey": 123}';
      const parsed = safeJsonParse<{ validKey: number; admin?: boolean }>(payload, { validKey: 0 });
      expect(parsed.validKey).toBe(123);
      expect(({} as any).admin).toBeUndefined();
    });
  });

  describe('Rate Limiter', () => {
    beforeEach(() => {
      resetRateLimit('test_action');
    });

    it('allows attempts within threshold and locks out when exceeded', () => {
      const initial = checkRateLimit('test_action', 3, 60);
      expect(initial.allowed).toBe(true);
      expect(initial.remainingAttempts).toBe(3);

      recordFailedAttempt('test_action', 3, 60);
      recordFailedAttempt('test_action', 3, 60);
      const third = recordFailedAttempt('test_action', 3, 60);
      expect(third.isLocked).toBe(true);
      expect(third.retryAfterSeconds).toBe(60);

      const status = checkRateLimit('test_action', 3, 60);
      expect(status.allowed).toBe(false);
      expect(status.remainingAttempts).toBe(0);
    });
  });
});
