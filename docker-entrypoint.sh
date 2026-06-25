#!/bin/sh

echo "🚀 Starting docker-entrypoint.sh..."

# Pegar API_BASE_URL da variável de ambiente
API_BASE_URL=${API_BASE_URL:-"http://localhost:3000"}

# Pegar VERSION: prioridade .version > package.json
if [ -f /usr/share/nginx/html/.version ]; then
    VERSION=$(cat /usr/share/nginx/html/.version)
    echo "✅ VERSION do arquivo .version: ${VERSION}"
elif [ -f /usr/share/nginx/html/package.json ]; then
    VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' /usr/share/nginx/html/package.json | sed 's/"version"[[:space:]]*:[[:space:]]*"\([^"]*\)"/\1/')
    echo "✅ VERSION do package.json: ${VERSION}"
else
    VERSION="0.1.0"
    echo "⚠️  Nenhuma fonte de versão encontrada, usando padrão: ${VERSION}"
fi

echo "✅ API_BASE_URL: ${API_BASE_URL}"

AUTH_PORTAL_URL=${AUTH_PORTAL_URL:-}

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__env = window.__env || {};
window.__env.apiBaseUrl = '${API_BASE_URL}';
window.__env.version = '${VERSION}';
window.__env.production = true;
window.__env.authPortalUrl = '${AUTH_PORTAL_URL}';
EOF

echo "✅ env-config.js criado com sucesso!"

# Criar version.json
BUILD_DATE=${BUILD_DATE:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}
cat > /usr/share/nginx/html/version.json <<EOF
{
  "version": "${VERSION}",
  "buildDate": "${BUILD_DATE}"
}
EOF
echo "✅ version.json criado: ${VERSION}"

# Criar version.json se a variável VERSION estiver definida
if [ -n "$VERSION" ]; then
    BUILD_DATE=${BUILD_DATE:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}
    cat > /usr/share/nginx/html/version.json <<EOF
{
  "version": "${VERSION}",
  "buildDate": "${BUILD_DATE}"
}
EOF
    echo "✅ version.json criado: ${VERSION}"
else
    echo "⚠️  VERSION não definida, usando fallback para package.json"
fi

# Execute the CMD
exec "$@"
