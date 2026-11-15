# Deligo Metal POS Security Policy & Hardening Specification

This document outlines the security architecture, threat model, and defense-in-depth measures implemented across **Deligo Metal POS**.

---

## 1. Authentication & Session Security

### A. Cryptographic Credential Hashing
- Administrative and operator credentials are encrypted using **SHA-256** digests via the native browser **Web Crypto API** (`crypto.subtle.digest`).
- Passwords are never stored, logged, or evaluated in plain text.

### B. Brute-Force & Credential Stuffing Defense
- In-memory and session-tracked rate limiter (`checkRateLimit` / `recordFailedAttempt`).
- Automatically locks out authentication attempts after **5 consecutive failed attempts** for **60 seconds**.
- Dynamic remaining attempt feedback alerts operators to potential unauthorized access.

### C. Banking-Grade Session Expiration
- Sessions are timestamped and automatically expire after **8 hours** (`SESSION_DURATION_MS = 28,800,000 ms`).
- Stale, invalid, or expired sessions are evicted from memory and persistent storage automatically upon route traversal (`ProtectedRoute.tsx`).

---

## 2. Injection & Cross-Site Scripting (XSS) Defenses

### A. Content Security Policy (CSP)
Rigorous CSP rules are enforced via HTTP meta headers:
```http
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
img-src 'self' data: https: blob:;
connect-src 'self' https://api.github.com;
object-src 'none';
base-uri 'self';
```

### B. Zero `dangerouslySetInnerHTML` & Zero `eval`
- The codebase prohibits `dangerouslySetInnerHTML`, `eval()`, and `new Function()`.
- Dynamic inputs are passed via React's safe virtual DOM escaping.
- Utility `sanitizeText()` escapes unsafe HTML characters (`&`, `<`, `>`, `"`, `'`, `/`).

### C. Prototype Pollution Defense
- Persistent reads through `getItem()` route through `safeJsonParse()`, automatically stripping `__proto__`, `constructor`, and `prototype` keys from untrusted inputs.

---

## 3. Reverse Tabnabbing & Navigation Safety

- All external link launches (such as WhatsApp invoice dispatch) explicitly enforce `rel="noopener noreferrer"` to prevent window hijacking or malicious origin replacement.

---

## 4. Financial Calculation & Data Integrity

### A. Strict Numerical Clamping (`sanitizeNumber`)
- Input weights, touch percentages, and monetary values are sanitized and clamped against negative overflows, `NaN`, or `Infinity` payloads.

### B. Formula / CSV Injection Mitigation
- Exported and printed strings are processed via `sanitizeForExport()`: values commencing with formula operators (`=`, `+`, `-`, `@`, `\t`, `\r`) are automatically escaped with leading single quotes to prevent unauthorized spreadsheet macro execution.

---

## 5. Security Verification Suite

- **Vitest Security Suite**: `src/utils/security.test.ts` (7 automated test specifications covering hashing, XSS sanitization, exploit defense, rate-limiting, and prototype pollution defense).
- **Total Calculation & Security Tests**: **69 tests passing with 100% assertion coverage**.

