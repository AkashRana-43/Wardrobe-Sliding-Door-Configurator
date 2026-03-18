# ── Base image ────────────────────────────────────────────────────────────────
# Alpine is a minimal Linux distro — keeps image size small (~50MB vs ~900MB)
FROM node:20-alpine

# ── System dependencies ───────────────────────────────────────────────────────
# libvips is required by Strapi's image processing library (sharp)
# Without this, Strapi crashes on startup in Alpine
RUN apk add --no-cache vips-dev

# ── Working directory ─────────────────────────────────────────────────────────
# All subsequent commands run from /app inside the container
WORKDIR /app

# ── Dependencies layer (cached) ───────────────────────────────────────────────
# Copy ONLY package files first — Docker caches this layer
# npm install only re-runs when package.json or package-lock.json changes
COPY package*.json ./
RUN npm install

# ── Source code ───────────────────────────────────────────────────────────────
# Copied after install — changes here don't invalidate the npm cache layer
COPY . .

# ── Port ──────────────────────────────────────────────────────────────────────
EXPOSE 1337

# ── Start command ─────────────────────────────────────────────────────────────
# develop mode enables Strapi's file watcher + admin panel auto-rebuild
CMD ["npm", "run", "develop"]