# Chat N8N - Angular Frontend

Frontend moderno da aplicação Chat N8N, construído com Angular 18 e componentes standalone.

## 🚀 Tecnologias

- **Angular 18** - Framework com componentes standalone
- **NgRx** - Gerenciamento de estado reativo
- **RxJS** - Programação reativa
- **Socket.io Client** - Comunicação em tempo real
- **Marked** - Renderização de Markdown
- **TypeScript** - Type-safe development

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm start

# Build de produção
npm run build:prod
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── core/                 # Serviços core, guards, interceptors
│   │   ├── guards/          # Route guards (auth)
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # Interfaces e tipos
│   │   └── services/        # Serviços (API, Auth, WebSocket, Theme)
│   ├── features/            # Features modulares
│   │   ├── admin/          # Painel administrativo
│   │   ├── auth/           # Login e registro
│   │   └── chat/           # Interface do chat
│   ├── shared/             # Componentes compartilhados
│   ├── store/              # NgRx (actions, reducers, effects, selectors)
│   ├── app.component.ts    # Root component
│   ├── app.config.ts       # Application configuration
│   └── app.routes.ts       # Rotas da aplicação
├── environments/           # Configurações de ambiente
├── assets/                # Assets estáticos
├── styles.css            # Design system global com CSS variables
└── main.ts               # Bootstrap da aplicação
```

## 🎨 Design System

O projeto utiliza um design system customizado com CSS variables para suporte a temas (claro/escuro):

### Variáveis Principais

- **Cores**: `--bg-primary`, `--text-primary`, `--accent`, etc.
- **Espaçamento**: `--spacing-xs` até `--spacing-2xl`
- **Border Radius**: `--radius-sm` até `--radius-full`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- **Transições**: `--transition-fast`, `--transition-normal`

## 📡 State Management (NgRx)

### Store Structure

```typescript
{
  auth: AuthState,      // Autenticação e usuário atual
  messages: MessagesState,  // Mensagens do chat
  config: ConfigState,  // Configurações da aplicação
  admin: AdminState     // Gerenciamento de usuários
}
```

### Principais Actions

- **Auth**: `login`, `register`, `logout`, `validateToken`
- **Messages**: `loadMessages`, `sendMessage`, `receiveMessage`
- **Config**: `loadConfig`
- **Admin**: `loadUsers`, `createUser`, `updateUser`, `deleteUser`

## 🔐 Autenticação

- JWT tokens armazenados em localStorage
- Auth guard protege rotas privadas
- Interceptor adiciona token automaticamente
- WebSocket authentication ao conectar

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint: 768px
- Comportamento do input adaptativo:
  - **Desktop**: Enter envia, Shift+Enter quebra linha
  - **Mobile**: Shift+Enter envia, Enter quebra linha

## 🐳 Docker

```bash
# Build da imagem
docker build -t chat-n8n-angular .

# Executar container
docker run -p 80:80 \
  -e API_BASE_URL=http://localhost:3000 \
  -e VERSION=0.1.0 \
  chat-n8n-angular
```

## 🔧 Variáveis de Ambiente

- `API_BASE_URL`: URL do backend (padrão: http://localhost:3000)
- `VERSION`: Versão da aplicação

## 📦 Scripts Disponíveis

- `npm start` - Inicia servidor de desenvolvimento
- `npm run build` - Build de desenvolvimento
- `npm run build:prod` - Build de produção otimizado
- `npm test` - Executa testes
- `npm run lint` - Verifica código

## 🌟 Features

### Autenticação
- Login e registro de usuários
- Validação de formulários
- Gerenciamento de sessão
- Logout automático em caso de token inválido

### Chat
- Mensagens em tempo real via WebSocket
- Renderização de Markdown
- Histórico de conversas
- Scroll automático
- Indicador de status online

### Painel Admin
- Lista de usuários
- Criar/editar/deletar usuários
- Gerenciar permissões (admin/usuário comum)
- Controle de licenças
- Status ativo/inativo

### Configurações
- Troca de tema (claro/escuro)
- Edição de nome de usuário
- Persistência de preferências

## 🎯 Boas Práticas Implementadas

- Componentes standalone (Angular 18)
- Programação reativa com RxJS
- State management centralizado (NgRx)
- Type-safe com TypeScript
- Design system com CSS variables
- Lazy loading de rotas
- HTTP interceptors
- Route guards
- Responsive design
- Sanitização de HTML (Markdown)
- Error handling
- Loading states

## 📚 Documentação Adicional

- [Angular Documentation](https://angular.io/docs)
- [NgRx Documentation](https://ngrx.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

ISC License

## ✨ Autor

Global-lanz
