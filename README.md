# TokenPeek

Browser-only JWT inspector.

- Decode header & payload (Base64URL)
- Timeline for `iat` / `nbf` / `exp`
- Optional HMAC verification (HS256 / HS384 / HS512) via Web Crypto

## Run

Open `index.html` in a browser, or serve the folder statically:

```bash
npx serve .
```

No build step. No server-side secrets leave the page.
