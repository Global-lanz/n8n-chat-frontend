# 🚀 Guia Rápido - GitHub Actions

## Para desenvolvedores

### 📦 Criar Release Candidate (RC)

```bash
# 1. Crie um branch
git checkout -b feature/minha-feature

# 2. Faça suas mudanças
# ... código ...

# 3. Commit e push
git add .
git commit -m "feat: minha nova feature"
git push origin feature/minha-feature

# 4. Abra PR no GitHub para main

# 5. Adicione a label "RC" no PR

# 6. Aguarde o workflow completar
# ✅ Build vai rodar automaticamente
# ✅ RC será criada (ex: RC.20260101.001)
# ✅ Imagem Docker será publicada
# ✅ Comentário será adicionado no PR
```

### 🎯 Release de Produção

```bash
# 1. Merge o PR aprovado para main

# 2. Workflow automático vai:
# ✅ Build Angular
# ✅ Publicar maiconlanzendorf/n8n-chat-frontend:0.1.0
# ✅ Publicar maiconlanzendorf/n8n-chat-frontend:latest
```

---

## 🧪 Testar Localmente Antes de Push

### Windows:
```powershell
.\test-build.ps1
```

### Linux/Mac:
```bash
bash test-build.sh
```

---

## 📝 Atualizar Versão

```bash
# 1. Edite package.json
# "version": "0.2.0"

# 2. Commit
git add package.json
git commit -m "chore: bump version to 0.2.0"

# 3. Push para main
# A nova versão (0.2.0) será usada automaticamente
```

---

## 🐳 Usar Imagem Docker

### RC (para testes):
```bash
docker pull maiconlanzendorf/n8n-chat-frontend:RC.20260101.001
docker run -p 80:80 \
  -e API_BASE_URL=http://localhost:3000 \
  -e VERSION=0.1.0 \
  maiconlanzendorf/n8n-chat-frontend:RC.20260101.001
```

### Produção:
```bash
docker pull maiconlanzendorf/n8n-chat-frontend:latest
docker run -p 80:80 \
  -e API_BASE_URL=https://api.seudominio.com \
  -e VERSION=0.1.0 \
  maiconlanzendorf/n8n-chat-frontend:latest
```

---

## 🔍 Verificar Status

### No GitHub:
1. Vá para `Actions` tab
2. Veja os workflows rodando
3. Clique no workflow para ver logs

### Localmente:
```bash
# Ver tags Git
git tag

# Ver últimas tags RC
git tag -l "RC.*"

# Ver imagens Docker
docker images | grep n8n-chat-frontend
```

---

## ⚠️ Troubleshooting

### Build falha no CI?
```bash
# Teste localmente primeiro
.\test-build.ps1

# Se funcionar local mas não no CI:
# - Verifique se commitou todos os arquivos
# - Verifique package-lock.json
```

### RC não está sendo criada?
```bash
# Verifique:
# 1. PR tem a label "RC"?
# 2. Branch está atualizado?
# 3. Workflow teve permissões negadas?
```

### Docker image não aparece?
```bash
# Verifique:
# 1. Secrets DOCKER_HUB_USER e DOCKER_HUB_PASSWORD estão configurados?
# 2. Workflow completou sem erros?
# 3. Login no Docker Hub funcionou?
```

---

## 📚 Mais Informações

- [VALIDATION_SUMMARY.md](VALIDATION_SUMMARY.md) - Validação completa
- [GITHUB_ACTIONS_VALIDATION.md](GITHUB_ACTIONS_VALIDATION.md) - Detalhes técnicos
- [README.md](README.md) - Documentação principal

---

**Pronto para começar!** 🎉
