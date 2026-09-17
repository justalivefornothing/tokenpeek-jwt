# Tokenpeek

Paste a JWT. The three segments light up, claims land on a timeline with a live “now” marker, and pasting the right secret flips the signature badge green — all in the browser via WebCrypto. Nothing leaves the tab.

Base64url decode is hand-written. HMAC verify covers HS256 / HS384 / HS512. Registered claims get annotations. You can edit the payload and re-sign to mint a new token. Sample tokens included.

Core (`src/lib`) is pure TypeScript with no React imports so it tests under Node. UI is React + Vite + Tailwind.

Architecture and remaining milestones live in `PLAN.md`.

## License

MIT
