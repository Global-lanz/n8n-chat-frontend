---
"chat-n8n-angular": minor
---

Add embed SSO support: this app can now be embedded (iframe) in a third-party app. `EMBED_ALLOWED_ORIGIN` generates a `Content-Security-Policy: frame-ancestors` header at container start, allowing only the configured origin(s) to iframe this app (replacing the previously always-on `X-Frame-Options: SAMEORIGIN`; unset behaves exactly as before). When the app detects it's running inside an iframe, the login screen no longer shows the password form — it always shows a generic "continue in the host app" link to `EMBED_FALLBACK_URL` instead, unconditionally (not based on whether the entered account exists), so it can't be used to probe account existence. Direct, top-level visits are unaffected either way.
