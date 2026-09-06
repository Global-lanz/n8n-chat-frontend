---
"chat-n8n-angular": patch
---

Corrige um espaço em branco que aparecia embaixo do campo de digitar ao rolar a tela, no celular e no chat embutido (iframe estreito). A causa: a folha de estilo global libera `overflow: auto` no `body` abaixo de 768px de largura (pra telas como admin/configurações que precisam rolar a página inteira no celular) — mas o chat gerencia sua própria rolagem interna e espera que a página nunca role, então qualquer folga de poucos pixels no cálculo de altura virava espaço em branco visível assim que a página passava a poder rolar. `ChatContainerComponent` agora trava a rolagem do `body` (classe `chat-locked`) enquanto a tela de chat está montada, restaurando o mesmo comportamento que o desktop já tinha.
