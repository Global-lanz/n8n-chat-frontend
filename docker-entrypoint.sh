#!/bin/sh

# Replace environment variables in built files
if [ -n "$API_BASE_URL" ]; then
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" {} \;
fi

if [ -n "$VERSION" ]; then
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__VERSION__|${VERSION}|g" {} \;
fi

# Execute the CMD
exec "$@"
