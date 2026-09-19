# TokenPeek

Browser-only JWT inspector. Tokens never leave the page.

## Features

- Decode header & payload (Base64URL)
- Timeline for `iat` / `nbf` / `exp` with relative times
- Optional HMAC verification (HS256 / HS384 / HS512) via Web Crypto

## Run

```bash
npx serve .
```

Or open `index.html` directly.

## Files

| File | Role |
|------|------|
| `index.html` | Layout |
| `app.js` | Decode + verify |
| `styles.css` | Dark inspector UI |

## License

MIT
