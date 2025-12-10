FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY package.json /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script de entrypoint para substituir a URL e versão em runtime
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'CHAT_API_URL=${CHAT_API_URL:-http://localhost:3000}' >> /entrypoint.sh && \
    echo 'VERSION=$(sed -n '"'"'s/.*"version": "\([^"]*\)".*/\1/p'"'"' /usr/share/nginx/html/package.json 2>/dev/null || echo "0.0.0")' >> /entrypoint.sh && \
    echo 'sed -i "s|__API_BASE_URL__|${CHAT_API_URL}|g; s|__VERSION__|${VERSION}|g" /usr/share/nginx/html/index.html' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]