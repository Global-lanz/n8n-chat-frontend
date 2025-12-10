FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Script de entrypoint para substituir a URL em runtime
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'CHAT_API_URL=${CHAT_API_URL:-http://localhost:3000}' >> /entrypoint.sh && \
    echo 'sed -i "s|__API_BASE_URL__|${CHAT_API_URL}|g" /usr/share/nginx/html/index.html' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]