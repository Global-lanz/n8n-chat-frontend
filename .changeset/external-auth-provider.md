---
"chat-n8n-angular": minor
---

Add support for authenticating via an external identity provider (SSO): in external mode login redirects to the central auth portal, an `/auth/callback` route exchanges the token, and the auth guard/interceptor redirect to the portal when configured.
