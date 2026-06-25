---
"chat-n8n-angular": patch
---

Login 401 (wrong password) no longer triggers a logout/redirect that hides the error — the interceptor only forces logout on token-bearing requests. Add a "🏠 Início" button to the top menu (external/SSO mode) that returns to the central auth portal home.
