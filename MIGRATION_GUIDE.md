# Guia de Migração - Vanilla JS para Angular

## 📋 Visão Geral

Este documento descreve a migração do frontend de Vanilla JavaScript para Angular 18 com componentes standalone.

## 🎯 Principais Mudanças

### Arquitetura

**Antes (Vanilla JS):**
- Single Page Application básica
- DOM manipulation direto
- Estado global com variáveis
- Event listeners manuais

**Depois (Angular):**
- Componentes standalone modulares
- Data binding reativo
- State management com NgRx
- Programação reativa com RxJS

### Estrutura de Arquivos

**Antes:**
```
frontend/
├── index.html
├── app.js
├── style.css
└── package.json
```

**Depois:**
```
frontend-angular/
├── src/
│   ├── app/
│   │   ├── core/        # Serviços, guards, interceptors
│   │   ├── features/    # Features modulares
│   │   ├── store/       # NgRx state management
│   │   └── shared/      # Componentes compartilhados
│   ├── environments/    # Configurações
│   └── styles.css       # Design system
├── angular.json
├── tsconfig.json
└── package.json
```

## 🔄 Mapeamento de Funcionalidades

### 1. Autenticação

**Vanilla JS:**
```javascript
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch(`${API_URL}/login`, {...});
    localStorage.setItem('token', data.token);
}
```

**Angular:**
```typescript
// Component
onLogin(): void {
    this.store.dispatch(AppActions.login({ email, password }));
}

// Effect
login$ = createEffect(() =>
    this.actions$.pipe(
        ofType(AppActions.login),
        switchMap(({ email, password }) =>
            this.authService.login({ email, password })
        )
    )
);

// Service
login(credentials: LoginRequest): Observable<User> {
    return this.apiService.login(credentials);
}
```

### 2. Gerenciamento de Estado

**Vanilla JS:**
```javascript
let token = localStorage.getItem('token');
let currentUser = null;
let messages = [];
```

**Angular (NgRx):**
```typescript
// State
interface AppState {
    auth: AuthState;
    messages: MessagesState;
    config: ConfigState;
    admin: AdminState;
}

// Selectors
selectCurrentUser = createSelector(
    selectAuthState,
    (state) => state.user
);

// Usage in component
currentUser$ = this.store.select(selectCurrentUser);
```

### 3. WebSocket

**Vanilla JS:**
```javascript
socket = io(socketUrl);
socket.on('new_message', (message) => {
    displayMessage(message.content, 'bot', message.timestamp);
});
```

**Angular:**
```typescript
// Service
export class WebSocketService {
    private messageSubject = new Subject<Message>();
    public messages$ = this.messageSubject.asObservable();
    
    connect(): void {
        this.socket = io(environment.apiBaseUrl);
        this.socket.on('new_message', (message: Message) => {
            this.messageSubject.next(message);
        });
    }
}

// Component
this.webSocketService.messages$.subscribe(message => {
    this.store.dispatch(AppActions.receiveMessage({ message }));
});
```

### 4. Renderização de Mensagens

**Vanilla JS:**
```javascript
function displayMessage(content, sender, timestamp) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `...`;
    container.appendChild(messageDiv);
}
```

**Angular:**
```typescript
// Template
@for (message of messages; track message.timestamp) {
    <div class="message {{ message.sender }}">
        <div class="message-content" 
             [innerHTML]="renderMarkdown(message.content)">
        </div>
    </div>
}

// Component
renderMarkdown(content: string): SafeHtml {
    const html = marked.parse(content);
    return this.sanitizer.bypassSecurityTrustHtml(html);
}
```

### 5. Tema (Claro/Escuro)

**Vanilla JS:**
```javascript
function changeTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('theme', theme);
}
```

**Angular:**
```typescript
// Service
export class ThemeService {
    private themeSubject = new BehaviorSubject<Theme>('dark');
    public theme$ = this.themeSubject.asObservable();
    
    setTheme(theme: Theme): void {
        localStorage.setItem('theme', theme);
        this.themeSubject.next(theme);
        this.applyTheme(theme);
    }
}

// Component
this.themeService.theme$.subscribe(theme => {
    // Automatically applied
});
```

## 🎨 CSS Variables - Design System

Mantido 100% compatível:

```css
:root {
    --bg-primary: #111b21;
    --text-primary: #e9edef;
    --accent: #00a884;
    /* ... */
}

body.light-mode {
    --bg-primary: #f0f2f5;
    /* ... */
}
```

## 📦 Dependências

### Novas Dependências Angular

```json
{
    "@angular/core": "^18.0.0",
    "@ngrx/store": "^18.0.0",
    "@ngrx/effects": "^18.0.0",
    "rxjs": "^7.8.1",
    "socket.io-client": "^4.7.0",
    "marked": "^12.0.0"
}
```

## 🚀 Benefícios da Migração

### Performance
- ✅ Change detection otimizada
- ✅ Lazy loading de módulos
- ✅ AOT compilation
- ✅ Tree shaking automático

### Desenvolvimento
- ✅ TypeScript type-safety
- ✅ Componentes reutilizáveis
- ✅ Testabilidade melhorada
- ✅ DevTools (Redux DevTools, Angular DevTools)

### Manutenibilidade
- ✅ Código mais organizado
- ✅ Separação de responsabilidades
- ✅ State management centralizado
- ✅ Padrões estabelecidos

### Escalabilidade
- ✅ Arquitetura modular
- ✅ Feature-based structure
- ✅ Dependency injection
- ✅ Reactive programming

## 🔧 Como Executar

### Desenvolvimento

```bash
cd frontend-angular
npm install
npm start
# Acesse http://localhost:4200
```

### Produção

```bash
npm run build:prod
# Arquivos em dist/chat-n8n-angular
```

### Docker

```bash
docker build -t chat-n8n-angular .
docker run -p 80:80 \
    -e API_BASE_URL=http://localhost:3000 \
    -e VERSION=0.1.0 \
    chat-n8n-angular
```

## 📝 Checklist de Migração

- [x] Estrutura do projeto Angular
- [x] Configuração TypeScript
- [x] Models e interfaces
- [x] Services (API, Auth, WebSocket, Theme)
- [x] HTTP Interceptor
- [x] Auth Guard
- [x] NgRx (Actions, Reducers, Effects, Selectors)
- [x] Componentes de Autenticação
- [x] Componentes do Chat
- [x] Painel de Administração
- [x] Design System (CSS Variables)
- [x] Roteamento
- [x] Dockerfile e nginx config
- [x] README e documentação

## 🎯 Próximos Passos

1. **Testes**: Implementar testes unitários e e2e
2. **PWA**: Adicionar Service Worker para funcionalidade offline
3. **I18n**: Internacionalização (múltiplos idiomas)
4. **Accessibility**: Melhorias de acessibilidade (ARIA)
5. **Analytics**: Integração com ferramentas de analytics

## ⚠️ Notas Importantes

- As CSS variables foram mantidas para garantir compatibilidade visual
- A API backend permanece a mesma
- Todos os endpoints são idênticos
- O comportamento do usuário é preservado
- WebSocket funciona da mesma forma

## 📚 Recursos

- [Angular Documentation](https://angular.io/docs)
- [NgRx Documentation](https://ngrx.io/docs)
- [RxJS Learn](https://www.learnrxjs.io/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
