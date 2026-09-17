# Tokenpeek JWT

Decode JWTs, inspect claims on a timeline, and verify HMAC signatures entirely in the browser via WebCrypto. Nothing leaves the tab.

## Features

- Base64url decoder from scratch (URL-safe alphabet, padding fix, UTF-8)
- Header + payload pretty-printed with registered claim annotations (`iss`, `sub`, `aud`, `exp`, `nbf`, `iat`, `jti`)
- HMAC verification for HS256 / HS384 / HS512 via `crypto.subtle`
- Claims timeline with live “now” marker and human-readable durations
- Status badges (expired, not yet valid, no expiry, `alg: none` warning)
- Edit payload and re-sign with a secret to mint a new HS256 token
- Sample tokens and colour-coded raw token display

## Tech

Core logic lives in pure TypeScript (`src/lib`) with no React imports so it can be unit-tested under Vitest in the Node environment. UI is React + Vite + Tailwind.

## Status

See `PLAN.md` for architecture and milestones. Scaffolding and plan are in place; remaining implementation steps are listed there.

## License

MIT
