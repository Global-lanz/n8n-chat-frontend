---
"chat-n8n-angular": minor
---

Remove as paletas Emerald, Ocean Blue, Amethyst, Sunset, Rose, Deep Indigo e Arctic Cyan (mantém Blueprint, Ruby Red e Imperial Gold) e adiciona a paleta NorteIA (branding Estúdio DUA: azul `#052e44` + amarelo `#f0c531`).

Tipografia agora é configurável por tema via `--font-ui`/`--font-content`: a paleta NorteIA usa Montserrat (interface) + Lora (balões do chat), e o `ThemeService` carrega essas fontes do Google sob demanda — só quando essa paleta está ativa, sem custo pras demais. A paleta NorteIA também usa raio de borda 16px em botões e cartões (as demais paletas continuam com os valores de sempre).

O nome do bot agora destaca um sufixo "IA" (ex.: NorteIA, GuIA) na cor de destaque (`--accent`) da paleta ativa, no cabeçalho do chat, tela de login e de cadastro — funciona automaticamente pra qualquer tema, não só NorteIA.

O tema claro passa a ser o padrão do sistema para novos usuários (antes era escuro) — quem já escolheu um tema não é afetado.

A mensagem inicial do chat e o placeholder da caixa de mensagem agora são configuráveis em Configurações → Aparência & Identidade, em vez de fixos no código.
