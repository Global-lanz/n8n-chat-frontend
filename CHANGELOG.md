# chat-n8n-angular

## 1.4.0

### Minor Changes

- 8a4bd53: Add support for authenticating via an external identity provider (SSO): in external mode login redirects to the central auth portal, an `/auth/callback` route exchanges the token, and the auth guard/interceptor redirect to the portal when configured.
- 8a4bd53: In external/SSO auth mode, the user settings screen now only manages the theme — name and password editing are removed (those are managed centrally in the auth portal) and replaced with a link to the portal account page. Internal mode is unchanged (full self-service).
- 8a4bd53: External auth mode UX: hide the local Users admin screen (managed centrally in the auth portal) and route-guard `/admin/users`, and make logout an SSO single logout — it now redirects to the portal's `/logout` so the user is signed out of every connected app, not just chat.

### Patch Changes

- 8a4bd53: Login 401 (wrong password) no longer triggers a logout/redirect that hides the error — the interceptor only forces logout on token-bearing requests. Add a "🏠 Início" button to the top menu (external/SSO mode) that returns to the central auth portal home.

## 1.3.0

### Minor Changes

- f20a0d8: Adiciona upload de logo da aplicação na aba "Aparência & Identidade" das configurações do sistema. A logo é exibida em formato circular no cabeçalho do chat (substituindo o ícone padrão) e como favicon dinâmico na aba do navegador.
