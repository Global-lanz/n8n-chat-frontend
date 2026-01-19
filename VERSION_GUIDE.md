# Guia de Versionamento - Frontend

## Como funciona

O frontend busca a versão na seguinte ordem:
1. **`/version.json`** - Criado dinamicamente pelo `docker-entrypoint.sh` a partir da variável `VERSION`
2. **`/package.json`** - Fallback para desenvolvimento (versão 1.0.0)

## Configuração

### Docker Compose

```yaml
services:
  frontend:
    build: ./frontend
    environment:
      - VERSION=1.0.0-RC1
      - BUILD_DATE=2026-01-04T10:30:00Z
      - APP_ENVIRONMENT=rc
    ports:
      - "80:80"
```

### GitHub Actions (Release Candidate)

```yaml
- name: Build Frontend Docker Image
  run: |
    docker build \
      --build-arg VERSION=1.0.0-RC${{ github.run_number }} \
      -t frontend:rc \
      ./frontend

- name: Run Frontend Container
  run: |
    docker run -d \
      -e VERSION=1.0.0-RC${{ github.run_number }} \
      -e BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
      -e APP_ENVIRONMENT=rc \
      -p 80:80 \
      frontend:rc
```

### GitHub Actions (Produção)

```yaml
- name: Build Frontend Docker Image
  run: |
    docker build \
      -t frontend:1.0.0 \
      ./frontend

- name: Run Frontend Container
  run: |
    docker run -d \
      -e VERSION=1.0.0 \
      -e BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
      -e APP_ENVIRONMENT=production \
      -p 80:80 \
      frontend:1.0.0
```

## Resultado

### Com VERSION definida
O `docker-entrypoint.sh` cria `/usr/share/nginx/html/version.json`:
```json
{
  "version": "1.0.0-RC1",
  "buildDate": "2026-01-04T10:30:00Z"
}
```

A UI mostra badge amarelo **"Release Candidate"** com a versão RC.

### Sem VERSION (desenvolvimento)
Usa `/package.json` como fallback → versão **1.0.0** → badge verde **"Estável"**.

## Verificação

Depois de iniciar o container:
```bash
# Verificar se version.json foi criado
curl http://localhost/version.json

# Ver logs do entrypoint
docker logs <container-id>
```

Você deve ver:
```
✅ version.json criado: 1.0.0-RC1
```
