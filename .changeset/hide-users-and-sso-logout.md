---
"chat-n8n-angular": minor
---

External auth mode UX: hide the local Users admin screen (managed centrally in the auth portal) and route-guard `/admin/users`, and make logout an SSO single logout — it now redirects to the portal's `/logout` so the user is signed out of every connected app, not just chat.
