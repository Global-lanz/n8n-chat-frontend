---
"chat-n8n-angular": patch
---

O rótulo de autor de cada mensagem trocou o 🤖 fixo por um avatar circular com a logo real da aplicação (mesma lógica de tema claro/escuro), caindo de volta pro 🤖 quando não há logo configurada. O rótulo do usuário deixou de dizer "Você" e agora mostra o nome de quem está logado.

O campo de digitar foi ajustado pra todos os temas: raio de 22px para 16px (consistente com o balão de mensagem), altura mínima de 44px, e corrigida uma barra de rolagem que aparecia sem necessidade mesmo com pouco texto (o `overflow-y` só liga quando o conteúdo realmente ultrapassa o limite de altura).
