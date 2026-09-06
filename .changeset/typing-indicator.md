---
"chat-n8n-angular": minor
---

Adiciona um indicador de "digitando..." (três pontinhos animados, na bolha do bot) enquanto a resposta do N8N ainda não chegou. Começa a contar assim que a mensagem do usuário é enviada e some assim que a resposta do bot chega pelo WebSocket; se nada chegar em 60 segundos, o indicador some sozinho e um aviso é mostrado ("A resposta está demorando mais que o normal."), pra não ficar esperando pra sempre se o N8N não responder.
