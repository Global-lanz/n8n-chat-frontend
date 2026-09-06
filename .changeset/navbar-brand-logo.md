---
"chat-n8n-angular": patch
---

Substitui o quadrado decorativo com ícone genérico de balão de chat no canto superior esquerdo do menu por um avatar circular com a logo real da aplicação (mesma lógica de tema claro/escuro do cabeçalho do chat, via `ThemeService.activeLogo$`) e o nome do bot ao lado, com o "IA" destacado. Sem logo configurada, cai no mesmo 🤖 usado no cabeçalho do chat.
