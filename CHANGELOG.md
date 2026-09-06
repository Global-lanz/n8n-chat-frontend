# chat-n8n-angular

## 1.7.0

### Minor Changes

- 1789878: Adiciona upload de uma segunda logo, específica pro tema escuro, na aba Aparência & Identidade — a logo já existente vira a do tema claro. `ThemeService.activeLogo$()` combina as duas logos com o tema ativo (com fallback pra a outra logo quando só uma foi enviada) e é usado no avatar do cabeçalho do chat, na tela de login e no favicon, que agora trocam de imagem em tempo real assim que o usuário alterna entre claro e escuro — não só no carregamento da página.
- 1789878: Remove as paletas Emerald, Ocean Blue, Amethyst, Sunset, Rose, Deep Indigo e Arctic Cyan (mantém Blueprint, Ruby Red e Imperial Gold) e adiciona a paleta NorteIA (branding Estúdio DUA: azul `#052e44` + amarelo `#f0c531`).

  Tipografia agora é configurável por tema via `--font-ui`/`--font-content`: a paleta NorteIA usa Montserrat (interface) + Lora (balões do chat), e o `ThemeService` carrega essas fontes do Google sob demanda — só quando essa paleta está ativa, sem custo pras demais. A paleta NorteIA também usa raio de borda 16px em botões e cartões (as demais paletas continuam com os valores de sempre).

  O nome do bot agora destaca um sufixo "IA" (ex.: NorteIA, GuIA) na cor de destaque (`--accent`) da paleta ativa, no cabeçalho do chat, tela de login e de cadastro — funciona automaticamente pra qualquer tema, não só NorteIA.

  O tema claro passa a ser o padrão do sistema para novos usuários (antes era escuro) — quem já escolheu um tema não é afetado.

  A mensagem inicial do chat e o placeholder da caixa de mensagem agora são configuráveis em Configurações → Aparência & Identidade, em vez de fixos no código.

- 1789878: Adiciona um indicador de "digitando..." (três pontinhos animados, na bolha do bot) enquanto a resposta do N8N ainda não chegou. Começa a contar assim que a mensagem do usuário é enviada e some assim que a resposta do bot chega pelo WebSocket; se nada chegar em 60 segundos, o indicador some sozinho e um aviso é mostrado ("A resposta está demorando mais que o normal."), pra não ficar esperando pra sempre se o N8N não responder.

### Patch Changes

- 1789878: Corrige a detecção de "Enter envia mensagem": antes usava a largura da janela (`window.innerWidth > 768`) para decidir entre Enter-envia (desktop) e Shift+Enter-envia (mobile). Como este chat é embutido numa gaveta estreita (~320px), qualquer usuário com teclado e mouse de verdade caía na classificação "mobile" só por causa do iframe estreito, e precisava de Shift+Enter para enviar. Agora a detecção usa o tipo de ponteiro (`pointer: coarse`), que reflete o dispositivo real e não o tamanho do contêiner.
- 1789878: Corrige um espaço em branco que aparecia embaixo do campo de digitar ao rolar a tela, no celular e no chat embutido (iframe estreito). A causa: a folha de estilo global libera `overflow: auto` no `body` abaixo de 768px de largura (pra telas como admin/configurações que precisam rolar a página inteira no celular) — mas o chat gerencia sua própria rolagem interna e espera que a página nunca role, então qualquer folga de poucos pixels no cálculo de altura virava espaço em branco visível assim que a página passava a poder rolar. `ChatContainerComponent` agora trava a rolagem do `body` (classe `chat-locked`) enquanto a tela de chat está montada, restaurando o mesmo comportamento que o desktop já tinha.
- 1789878: O toggle de tema claro/escuro nas configurações agora aplica e salva na hora — antes só mudava um estado local e o usuário precisava clicar em "Salvar alterações" pra ver (e manter) o tema trocado. Reaproveita o mesmo fluxo que o modo externo (SSO) já usava pra persistir só o tema sem alterar o nome.
- 1789878: O rótulo de autor de cada mensagem trocou o 🤖 fixo por um avatar circular com a logo real da aplicação (mesma lógica de tema claro/escuro), caindo de volta pro 🤖 quando não há logo configurada. O rótulo do usuário deixou de dizer "Você" e agora mostra o nome de quem está logado.

  O campo de digitar foi ajustado pra todos os temas: raio de 22px para 16px (consistente com o balão de mensagem), altura mínima de 44px, e corrigida uma barra de rolagem que aparecia sem necessidade mesmo com pouco texto (o `overflow-y` só liga quando o conteúdo realmente ultrapassa o limite de altura).

- 1789878: Substitui o quadrado decorativo com ícone genérico de balão de chat no canto superior esquerdo do menu por um avatar circular com a logo real da aplicação (mesma lógica de tema claro/escuro do cabeçalho do chat, via `ThemeService.activeLogo$`) e o nome do bot ao lado, com o "IA" destacado. Sem logo configurada, cai no mesmo 🤖 usado no cabeçalho do chat.
- 1789878: Ajusta o fundo (`#f0f4f8` → `#f9fafb`) e o texto (`#1a2535` → `#1f2937`) do tema claro da paleta NorteIA para os hex exatos do Estúdio DUA — só nessa paleta, os demais temas mantêm o fundo/texto de sempre.

## 1.6.0

### Minor Changes

- 636eae9: Adiciona upload de uma segunda logo, específica pro tema escuro, na aba Aparência & Identidade — a logo já existente vira a do tema claro. `ThemeService.activeLogo$()` combina as duas logos com o tema ativo (com fallback pra a outra logo quando só uma foi enviada) e é usado no avatar do cabeçalho do chat, na tela de login e no favicon, que agora trocam de imagem em tempo real assim que o usuário alterna entre claro e escuro — não só no carregamento da página.
- 636eae9: Remove as paletas Emerald, Ocean Blue, Amethyst, Sunset, Rose, Deep Indigo e Arctic Cyan (mantém Blueprint, Ruby Red e Imperial Gold) e adiciona a paleta NorteIA (branding Estúdio DUA: azul `#052e44` + amarelo `#f0c531`).

  Tipografia agora é configurável por tema via `--font-ui`/`--font-content`: a paleta NorteIA usa Montserrat (interface) + Lora (balões do chat), e o `ThemeService` carrega essas fontes do Google sob demanda — só quando essa paleta está ativa, sem custo pras demais. A paleta NorteIA também usa raio de borda 16px em botões e cartões (as demais paletas continuam com os valores de sempre).

  O nome do bot agora destaca um sufixo "IA" (ex.: NorteIA, GuIA) na cor de destaque (`--accent`) da paleta ativa, no cabeçalho do chat, tela de login e de cadastro — funciona automaticamente pra qualquer tema, não só NorteIA.

  O tema claro passa a ser o padrão do sistema para novos usuários (antes era escuro) — quem já escolheu um tema não é afetado.

  A mensagem inicial do chat e o placeholder da caixa de mensagem agora são configuráveis em Configurações → Aparência & Identidade, em vez de fixos no código.

### Patch Changes

- 636eae9: Substitui o quadrado decorativo com ícone genérico de balão de chat no canto superior esquerdo do menu por um avatar circular com a logo real da aplicação (mesma lógica de tema claro/escuro do cabeçalho do chat, via `ThemeService.activeLogo$`) e o nome do bot ao lado, com o "IA" destacado. Sem logo configurada, cai no mesmo 🤖 usado no cabeçalho do chat.

## 1.5.0

### Minor Changes

- e0fb950: Add embed SSO support: this app can now be embedded (iframe) in a third-party app. `EMBED_ALLOWED_ORIGIN` generates a `Content-Security-Policy: frame-ancestors` header at container start, allowing only the configured origin(s) to iframe this app (replacing the previously always-on `X-Frame-Options: SAMEORIGIN`; unset behaves exactly as before). When the app detects it's running inside an iframe, the login screen no longer shows the password form — it always shows a generic "continue in the host app" link to `EMBED_FALLBACK_URL` instead, unconditionally (not based on whether the entered account exists), so it can't be used to probe account existence. Direct, top-level visits are unaffected either way.

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
