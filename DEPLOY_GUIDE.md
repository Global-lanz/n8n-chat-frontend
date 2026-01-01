# Guia de Instalação e Deploy - Chat N8N Angular

## 📋 Índice

1. [Desenvolvimento Local](#desenvolvimento-local)
2. [Build de Produção](#build-de-produção)
3. [Deploy com Docker](#deploy-com-docker)
4. [Deploy em Servidor](#deploy-em-servidor)
5. [Configurações Avançadas](#configurações-avançadas)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Desenvolvimento Local

### Pré-requisitos

- **Node.js**: v20.x ou superior
- **npm**: v10.x ou superior
- **Backend**: Servidor rodando em http://localhost:3000

### Passo a Passo

```bash
# 1. Navegue até o diretório do projeto
cd frontend-angular

# 2. Instale as dependências
npm install

# 3. Configure o ambiente (opcional)
# Edite src/environments/environment.ts se necessário

# 4. Inicie o servidor de desenvolvimento
npm start

# A aplicação estará disponível em http://localhost:4200
```

### Comandos Úteis

```bash
# Desenvolvimento com watch mode
npm run watch

# Build de desenvolvimento
npm run build

# Executar testes
npm test

# Lint do código
npm run lint
```

---

## 📦 Build de Produção

### Build Local

```bash
# Build otimizado para produção
npm run build:prod

# Os arquivos estarão em: dist/chat-n8n-angular/browser
```

### Configurações de Build

O build de produção inclui:
- ✅ AOT (Ahead of Time) compilation
- ✅ Tree shaking
- ✅ Minificação
- ✅ Otimização de bundle
- ✅ Source maps desabilitados (produção)

### Estrutura do Build

```
dist/chat-n8n-angular/browser/
├── index.html
├── main-[hash].js
├── polyfills-[hash].js
├── styles-[hash].css
└── assets/
```

---

## 🐳 Deploy com Docker

### Build da Imagem

```bash
# Build da imagem Docker
docker build -t chat-n8n-angular:latest .

# Build com versão específica
docker build -t chat-n8n-angular:0.1.0 .
```

### Executar Container

```bash
# Básico
docker run -p 80:80 chat-n8n-angular:latest

# Com variáveis de ambiente
docker run -p 80:80 \
  -e API_BASE_URL=https://api.seudominio.com \
  -e VERSION=0.1.0 \
  chat-n8n-angular:latest

# Com nome e restart automático
docker run -d \
  --name chat-frontend \
  --restart unless-stopped \
  -p 80:80 \
  -e API_BASE_URL=https://api.seudominio.com \
  chat-n8n-angular:latest
```

### Docker Compose

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend-angular
    ports:
      - "80:80"
    environment:
      - API_BASE_URL=http://backend:3000
      - VERSION=0.1.0
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
    restart: unless-stopped
```

Execute:

```bash
docker-compose up -d
```

---

## 🌐 Deploy em Servidor

### Opção 1: Nginx Manual

#### 1. Build da Aplicação

```bash
npm run build:prod
```

#### 2. Instale o Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 3. Copie os Arquivos

```bash
# Copie os arquivos do build
sudo cp -r dist/chat-n8n-angular/browser/* /var/www/chat-n8n/

# Ajuste permissões
sudo chown -R www-data:www-data /var/www/chat-n8n
sudo chmod -R 755 /var/www/chat-n8n
```

#### 4. Configure o Nginx

Crie `/etc/nginx/sites-available/chat-n8n`:

```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /var/www/chat-n8n;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/json;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # No cache for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### 5. Ative o Site

```bash
# Crie link simbólico
sudo ln -s /etc/nginx/sites-available/chat-n8n /etc/nginx/sites-enabled/

# Teste a configuração
sudo nginx -t

# Reinicie o Nginx
sudo systemctl restart nginx
```

### Opção 2: SSL com Let's Encrypt

```bash
# Instale o Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenha certificado SSL
sudo certbot --nginx -d seudominio.com

# Renovação automática já está configurada
```

A configuração SSL será:

```nginx
server {
    listen 443 ssl http2;
    server_name seudominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    
    # ... resto da configuração
}

server {
    listen 80;
    server_name seudominio.com;
    return 301 https://$server_name$request_uri;
}
```

---

## ⚙️ Configurações Avançadas

### Variáveis de Ambiente

#### Desenvolvimento
Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  version: '0.1.0'
};
```

#### Produção
Edite `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: '__API_BASE_URL__',  // Substituído no build
  version: '__VERSION__'            // Substituído no build
};
```

### Build com Substituição de Variáveis

```bash
# No Dockerfile, as variáveis são substituídas no runtime
# Você pode passar via docker run:
docker run -p 80:80 \
  -e API_BASE_URL=https://api.example.com \
  -e VERSION=1.0.0 \
  chat-n8n-angular
```

### Proxy de Desenvolvimento

Para evitar CORS durante desenvolvimento, crie `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

E execute:

```bash
ng serve --proxy-config proxy.conf.json
```

---

## 🔍 Troubleshooting

### Problema: CORS Errors

**Solução 1**: Configure CORS no backend

```javascript
// backend/server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

**Solução 2**: Use proxy de desenvolvimento (veja acima)

### Problema: WebSocket não conecta

**Verificações**:
1. Backend está rodando?
2. URL do WebSocket está correta?
3. Firewall bloqueando conexões?

**Debug**:
```typescript
// No WebSocketService, adicione logs
connect(): void {
    console.log('Connecting to:', environment.apiBaseUrl);
    this.socket = io(environment.apiBaseUrl);
    
    this.socket.on('connect', () => {
        console.log('WebSocket connected');
    });
    
    this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });
}
```

### Problema: Build falha

**Erro comum**: Memory limit

```bash
# Aumenta o limite de memória do Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:prod
```

### Problema: Docker image muito grande

**Otimizações**:
1. Use multi-stage build (já implementado)
2. Use .dockerignore:

```
node_modules
dist
.git
.angular
*.md
```

### Problema: Nginx 404 em rotas

**Solução**: Certifique-se que `try_files $uri $uri/ /index.html;` está na configuração.

---

## 📊 Monitoramento

### Nginx Access Logs

```bash
# Visualizar logs em tempo real
sudo tail -f /var/log/nginx/access.log

# Visualizar erros
sudo tail -f /var/log/nginx/error.log
```

### Docker Logs

```bash
# Logs do container
docker logs chat-frontend

# Logs em tempo real
docker logs -f chat-frontend
```

### Health Check

Adicione ao docker-compose.yml:

```yaml
services:
  frontend:
    # ... outras configurações
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## 🔄 CI/CD

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend-angular
      
      - name: Build
        run: npm run build:prod
        working-directory: ./frontend-angular
      
      - name: Deploy to server
        # ... seus passos de deploy
```

---

## 📝 Checklist de Deploy

- [ ] Build de produção executado com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] SSL configurado (produção)
- [ ] Nginx configurado corretamente
- [ ] Gzip habilitado
- [ ] Security headers configurados
- [ ] Logs acessíveis
- [ ] Health checks funcionando
- [ ] Backup configurado
- [ ] Monitoramento ativo

---

## 🆘 Suporte

- **Issues**: GitHub Issues
- **Documentação**: README.md e MIGRATION_GUIDE.md
- **Logs**: Sempre verifique os logs primeiro

---

**Última atualização**: 2026-01-01
