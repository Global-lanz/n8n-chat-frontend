#!/bin/sh

echo "🚀 Starting docker-entrypoint.sh..."

# Replace environment variables in built files
if [ -n "$API_BASE_URL" ]; then
    echo "✅ API_BASE_URL found: ${API_BASE_URL}"
    echo "🔍 Searching for __API_BASE_URL__ in JS files..."
    
    # Contar quantos placeholders existem antes
    BEFORE_COUNT=$(grep -r "__API_BASE_URL__" /usr/share/nginx/html/*.js 2>/dev/null | wc -l)
    echo "📊 Found ${BEFORE_COUNT} occurrences of __API_BASE_URL__"
    
    # Substituir
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" {} \;
    
    # Verificar se substituiu
    AFTER_COUNT=$(grep -r "__API_BASE_URL__" /usr/share/nginx/html/*.js 2>/dev/null | wc -l)
    echo "📊 Remaining placeholders: ${AFTER_COUNT}"
    
    if [ "$AFTER_COUNT" -eq 0 ] && [ "$BEFORE_COUNT" -gt 0 ]; then
        echo "✅ API_BASE_URL replacement successful!"
    else
        echo "⚠️  Warning: API_BASE_URL may not have been replaced correctly"
    fi
else
    echo "❌ API_BASE_URL not set!"
fi

if [ -n "$VERSION" ]; then
    echo "✅ VERSION found: ${VERSION}"
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__VERSION__|${VERSION}|g" {} \;
else
    echo "⚠️  VERSION not set"
fi

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
