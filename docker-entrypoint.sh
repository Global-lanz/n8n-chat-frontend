#!/bin/sh

# Replace environment variables in built files
if [ -n "$API_BASE_URL" ]; then
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" {} \;
fi

if [ -n "$VERSION" ]; then
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__VERSION__|${VERSION}|g" {} \;
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
