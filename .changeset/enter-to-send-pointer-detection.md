---
"chat-n8n-angular": patch
---

Corrige a detecção de "Enter envia mensagem": antes usava a largura da janela (`window.innerWidth > 768`) para decidir entre Enter-envia (desktop) e Shift+Enter-envia (mobile). Como este chat é embutido numa gaveta estreita (~320px), qualquer usuário com teclado e mouse de verdade caía na classificação "mobile" só por causa do iframe estreito, e precisava de Shift+Enter para enviar. Agora a detecção usa o tipo de ponteiro (`pointer: coarse`), que reflete o dispositivo real e não o tamanho do contêiner.
