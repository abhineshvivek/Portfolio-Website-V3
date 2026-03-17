#!/usr/bin/env bash
# Cloudflare Pages Build Script for Webb Portfolio + Sanity Studio

# Exit on any error
set -e

echo "=== 1. Building Vite Frontend ==="
npm ci
npm run build

echo "=== 2. Building Sanity Studio CMS ==="
cd studio
npm ci
npm run build
cd ..

echo "=== 3. Merging Builds for Cloudflare Pages ==="
# Create a `/studio` directory inside the frontend's output `dist` folder
mkdir -p dist/studio

# Copy the compiled Sanity CMS files into the new `/studio` folder
cp -R studio/dist/* dist/studio/

echo "=== 4. Configuring Routing for Cloudflare Pages ==="
# Cloudflare Pages tries to serve the main index.html for all routes (SPA fallback).
# We must explicitly tell it to let the `/studio/` path load its own index.html
cat << 'EOF' > dist/_routes.json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/studio/*"]
}
EOF

echo "=== Build Complete! Cloudflare will now deploy the 'dist' directory. ==="
