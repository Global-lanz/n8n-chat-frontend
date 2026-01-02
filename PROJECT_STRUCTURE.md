# Estrutura Completa do Projeto - Chat N8N Angular

```
frontend-angular/
│
├── src/
│   ├── app/
│   │   │
│   │   ├── core/                           # Core module - Serviços essenciais
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts          # Proteção de rotas
│   │   │   │
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts    # Injeção automática de token
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── index.ts               # Interfaces e tipos TypeScript
│   │   │   │
│   │   │   └── services/
│   │   │       ├── api.service.ts         # Comunicação com API
│   │   │       ├── auth.service.ts        # Autenticação
│   │   │       ├── websocket.service.ts   # WebSocket real-time
│   │   │       ├── theme.service.ts       # Gerenciamento de tema
│   │   │       └── index.ts
│   │   │
│   │   ├── features/                       # Features modulares
│   │   │   │
│   │   │   ├── auth/                      # Autenticação
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.css
│   │   │   │   │
│   │   │   │   └── register/
│   │   │   │       ├── register.component.ts
│   │   │   │       ├── register.component.html
│   │   │   │       └── register.component.css
│   │   │   │
│   │   │   ├── chat/                      # Interface do chat
│   │   │   │   ├── chat-container/
│   │   │   │   │   ├── chat-container.component.ts
│   │   │   │   │   ├── chat-container.component.html
│   │   │   │   │   └── chat-container.component.css
│   │   │   │   │
│   │   │   │   ├── chat-header/
│   │   │   │   │   ├── chat-header.component.ts
│   │   │   │   │   ├── chat-header.component.html
│   │   │   │   │   └── chat-header.component.css
│   │   │   │   │
│   │   │   │   ├── message-list/
│   │   │   │   │   ├── message-list.component.ts
│   │   │   │   │   ├── message-list.component.html
│   │   │   │   │   └── message-list.component.css
│   │   │   │   │
│   │   │   │   ├── message-input/
│   │   │   │   │   ├── message-input.component.ts
│   │   │   │   │   ├── message-input.component.html
│   │   │   │   │   └── message-input.component.css
│   │   │   │   │
│   │   │   │   └── settings-menu/
│   │   │   │       ├── settings-menu.component.ts
│   │   │   │       ├── settings-menu.component.html
│   │   │   │       └── settings-menu.component.css
│   │   │   │
│   │   │   └── admin/                     # Painel administrativo
│   │   │       ├── admin-panel/
│   │   │       │   ├── admin-panel.component.ts
│   │   │       │   ├── admin-panel.component.html
│   │   │       │   └── admin-panel.component.css
│   │   │       │
│   │   │       ├── user-form/
│   │   │       │   ├── user-form.component.ts
│   │   │       │   ├── user-form.component.html
│   │   │       │   └── user-form.component.css
│   │   │       │
│   │   │       └── users-table/
│   │   │           ├── users-table.component.ts
│   │   │           ├── users-table.component.html
│   │   │           └── users-table.component.css
│   │   │
│   │   ├── shared/                        # Componentes compartilhados
│   │   │   └── (componentes reutilizáveis)
│   │   │
│   │   ├── store/                         # NgRx State Management
│   │   │   ├── actions/
│   │   │   │   └── app.actions.ts         # Actions do NgRx
│   │   │   │
│   │   │   ├── reducers/
│   │   │   │   └── app.reducer.ts         # Reducers e State
│   │   │   │
│   │   │   ├── effects/
│   │   │   │   └── app.effects.ts         # Side Effects
│   │   │   │
│   │   │   ├── selectors/
│   │   │   │   └── app.selectors.ts       # Selectors
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── app.component.ts               # Root Component
│   │   ├── app.config.ts                  # App Configuration
│   │   └── app.routes.ts                  # Rotas
│   │
│   ├── assets/                            # Assets estáticos
│   │   └── (imagens, ícones, etc)
│   │
│   ├── environments/                      # Configurações de ambiente
│   │   ├── environment.ts                 # Desenvolvimento
│   │   └── environment.prod.ts            # Produção
│   │
│   ├── index.html                         # HTML principal
│   ├── main.ts                            # Bootstrap da aplicação
│   └── styles.css                         # Design System Global
│
├── .gitignore                             # Git ignore
├── angular.json                           # Configuração Angular CLI
├── CHANGELOG.md                           # Histórico de mudanças
├── DEPLOY_GUIDE.md                        # Guia de deploy
├── docker-entrypoint.sh                   # Script Docker entrypoint
├── Dockerfile                             # Docker image config
├── MIGRATION_GUIDE.md                     # Guia de migração
├── nginx.conf                             # Configuração Nginx
├── package.json                           # Dependências NPM
├── README.md                              # Documentação principal
├── tsconfig.app.json                      # TypeScript config (app)
└── tsconfig.json                          # TypeScript config (base)
```

## 📊 Estatísticas do Projeto

### Linhas de Código (aproximado)

- **TypeScript**: ~3,500 linhas
- **HTML**: ~1,200 linhas
- **CSS**: ~1,000 linhas
- **Total**: ~5,700 linhas

### Arquivos por Tipo

- **Components**: 13 componentes
- **Services**: 4 serviços
- **Guards**: 1 guard
- **Interceptors**: 1 interceptor
- **Models**: 1 arquivo de interfaces
- **Store**: 4 arquivos NgRx

### Dependências

- **Production**: 11 pacotes
- **Development**: 3 pacotes

## 🎯 Responsabilidades por Diretório

### `/src/app/core/`
**Propósito**: Funcionalidades essenciais usadas em toda a aplicação
- Guards para proteção de rotas
- Interceptors HTTP
- Modelos de dados (interfaces)
- Serviços singleton

### `/src/app/features/`
**Propósito**: Features modulares e independentes
- **auth/**: Login e registro
- **chat/**: Interface principal do chat
- **admin/**: Painel administrativo

### `/src/app/store/`
**Propósito**: Gerenciamento de estado centralizado
- **actions/**: Ações disparadas pela UI
- **reducers/**: Estado e transformações
- **effects/**: Side effects (API calls, etc)
- **selectors/**: Queries para o estado

### `/src/app/shared/`
**Propósito**: Componentes, pipes, directives reutilizáveis
- Componentes UI genéricos
- Pipes customizados
- Directives customizadas

## 🔄 Fluxo de Dados

```
Component
    ↓
dispatch(Action)
    ↓
Effect (API Call)
    ↓
Success/Failure Action
    ↓
Reducer (Update State)
    ↓
Selector
    ↓
Component (via Observable)
    ↓
Template (async pipe)
```

## 📦 Organização de Imports

```typescript
// 1. Angular imports
import { Component } from '@angular/core';

// 2. RxJS imports
import { Observable } from 'rxjs';

// 3. NgRx imports
import { Store } from '@ngrx/store';

// 4. Local imports (usando path aliases)
import { User } from '@core/models';
import { AuthService } from '@core/services';
import * as AppActions from '@store/actions/app.actions';
```

## 🎨 Convenções de Nomenclatura

### Arquivos
- **Components**: `feature-name.component.ts`
- **Services**: `service-name.service.ts`
- **Guards**: `guard-name.guard.ts`
- **Interceptors**: `interceptor-name.interceptor.ts`
- **Models**: `index.ts` (barrel file)

### Classes
- **Components**: `FeatureNameComponent`
- **Services**: `ServiceNameService`
- **Guards**: `GuardNameGuard`
- **Interfaces**: `InterfaceName` (sem I prefix)

### Constantes
- **Actions**: `SNAKE_CASE`
- **Selectors**: `camelCase`
- **CSS Variables**: `--kebab-case`

## 🚀 Build & Bundle

### Development Build
```
main.js           ~500 KB
polyfills.js      ~100 KB
styles.css        ~50 KB
```

### Production Build (minified + gzipped)
```
main-[hash].js           ~150 KB
polyfills-[hash].js      ~40 KB
styles-[hash].css        ~15 KB
Total                    ~205 KB
```

## 🔍 Análise de Dependências

### Runtime Dependencies
- **Angular Core**: ~150 KB (gzipped)
- **RxJS**: ~30 KB (gzipped)
- **NgRx**: ~20 KB (gzipped)
- **Socket.io**: ~25 KB (gzipped)
- **Marked**: ~10 KB (gzipped)

### Total Bundle Size
- **Initial Load**: ~205 KB (gzipped)
- **Time to Interactive**: < 3s (4G network)

## 📈 Performance Metrics

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+

## 🛡️ Security Features

- ✅ JWT Token Management
- ✅ Route Guards
- ✅ HTTP Interceptors
- ✅ XSS Prevention (DomSanitizer)
- ✅ CSRF Ready
- ✅ Security Headers (Nginx)
- ✅ HTTPS Ready

## 🧪 Testing Strategy

### Unit Tests (Planned)
- Services: 100% coverage
- Components: 80% coverage
- Guards/Interceptors: 100% coverage

### E2E Tests (Planned)
- User flows críticos
- Admin operations
- Real-time messaging

## 📚 Documentação

- **README.md**: Visão geral e quick start
- **MIGRATION_GUIDE.md**: Migração do Vanilla JS
- **DEPLOY_GUIDE.md**: Deploy e instalação
- **CHANGELOG.md**: Histórico de versões
- **PROJECT_STRUCTURE.md**: Este arquivo

---

**Última atualização**: 2026-01-01  
**Versão**: 0.1.0
