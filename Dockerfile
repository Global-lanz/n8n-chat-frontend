# Build Stage
FROM node:20-alpine AS build

# Argumento para versão (opcional)
ARG VERSION

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Se VERSION foi passado, criar arquivo com a versão
RUN if [ -n "$VERSION" ]; then \
      echo "$VERSION" > /app/dist/chat-n8n-angular/browser/.version; \
      echo "✅ Versão ${VERSION} salva em .version"; \
    fi

# Production Stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist/chat-n8n-angular/browser /usr/share/nginx/html

# Copy package.json para fallback de versão
COPY --from=build /app/package.json /usr/share/nginx/html/package.json

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
