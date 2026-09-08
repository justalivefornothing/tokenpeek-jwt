# Tokenpeek — plan

Decode JWTs, inspect claims on a timeline, and verify HMAC signatures entirely in
the browser via WebCrypto. Nothing leaves the tab.

## Goal

A single-page devtool that feels like a security badge scanner: paste a token, the
three segments light up in their own colours, the registered claims are annotated,
the exp/nbf/iat claims land on a horizontal timeline with a live "now" marker, and
pasting the right secret flips the signature badge from grey to green in real time.

## Features (all required)

1. Base64url decoder from scratch — URL-safe alphabet, padding fix, UTF-8 decode via
   `TextDecoder`, per-segment error reporting.
2. Header + payload pretty-printed with registered claim annotations
   (`iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti`).
3. HMAC verification for HS256 / HS384 / HS512 via `crypto.subtle`; secret as text
   or base64.
4. Claims timeline: iat -> nbf -> exp on a scale with a live "now" marker and
   human-readable durations.
5. Status badges: expired, not yet valid, no expiry, `alg: none` warning.
6. Edit the payload and re-sign with a secret to mint a new HS256 token.
7. Sample tokens and a colour-coded raw token display (header.payload.signature).

## Architecture

```
src/
  lib/
    base64url.ts   encode/decode (index table -> Uint8Array), utf8 helpers
    jwt.ts         splitJwt / decodeJwt (structural validation, per-segment errors)
    hmac.ts        verifyHmac (HS256/384/512, timing-safe compare), signHs256
    claims.ts      registered claim annotations, tokenStatus, formatDuration
    timeline.ts    scaleTimeline: epoch seconds -> normalized [0,1] positions
    samples.ts     sample tokens (valid, expired, not-yet-valid, alg none)
  components/
    TokenInput     textarea + colour-coded raw token mirror + samples
    StatusBar      signature badge + token status badges
    Timeline       hero timeline with now marker
    SegmentCard    pretty-printed JSON with claim annotations
    SecretInput    text / base64 toggle, live verification
    Resigner       editable payload -> new token
  App.tsx          wide two-row layout: hero (input + timeline), then cards
```

Core logic lives in `src/lib` with no React imports so it can be unit tested under
vitest in the plain `node` environment (Node ships `crypto.subtle` globally).

## Milestones

- [x] plan, license, gitignore
- [ ] scaffold vite react-ts + tailwind + vitest
- [ ] core: base64url, jwt decode, hmac verify/sign, status, timeline scaler (+tests)
- [ ] UI: token input, colour-coded token, segment cards, badges
- [ ] UI: timeline hero, secret input with live verification
- [ ] UI: re-sign editor, samples, polish, responsive to ~380px
- [ ] build, smoke test, screenshot
- [ ] README, publish
