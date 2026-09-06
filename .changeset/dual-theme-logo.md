---
"chat-n8n-angular": minor
---

Adiciona upload de uma segunda logo, específica pro tema escuro, na aba Aparência & Identidade — a logo já existente vira a do tema claro. `ThemeService.activeLogo$()` combina as duas logos com o tema ativo (com fallback pra a outra logo quando só uma foi enviada) e é usado no avatar do cabeçalho do chat, na tela de login e no favicon, que agora trocam de imagem em tempo real assim que o usuário alterna entre claro e escuro — não só no carregamento da página.
