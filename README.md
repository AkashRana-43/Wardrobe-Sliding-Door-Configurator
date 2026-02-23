# Wardrobe-Sliding-Door-Configurator
React + TypeScript (Vite) wardrobe sliding door configurator with step-based state, per-door customisation, skeleton/lazy-loaded UI, and a data layer that works with dummy data or a Strapi API (optionally cached via Redis).

A modern wardrobe sliding door configurator built with React + TypeScript + Vite, designed around a clean domain model and a step-based configuration flow. It supports dummy data for fast local development and demo environments, while also being able to fetch catalog options from Strapi (with optional Redis-backed caching) for production-ready data management. The UI is optimized for responsiveness using skeleton loading, lazy-loaded routes/components, and image-driven option previews.

# Frontend

React + TypeScript
Vite
Lazy loading (routes + heavy components)
Skeleton loading for async catalog fetches
Image-based option previews + colour swatches (e.g. melamine hexPreview)

# Backend (Optional)

Strapi (CMS + pricing fields + assets)
Redis

# Features

Step-based configurator flow

State is modeled as WardrobeConfiguratorState with explicit step progression:
- Wardrobe Type: Wall/end panel combinations with base price.
- Dimensions: Width/height in mm with min/max validation constraints.
- Width Range + Door Count Rules: Width selects a WardrobeWidthRange, unlocking only allowed door counts and applying a base price.
- Door Style + Finish + Per-door Configuration:
 - Door style: Plain or MultiPanel
 - Finish: Melamine colour selection (Hex Preview for UI)
 -Per-door configuration with variable pricing:
  - MultiPanel Count: 3 | 4 | null
  - Premium Insert
  - Mirror Panel Addition
- Stiles/Tracks + Extras
 -Stiles & tracks selection with colour + price
 -Extras as optional
  
# Data sources

Dummy data

By default the configurator can run fully offline using local in-repo catalog data


Strapi API (Optional)

When enabled, the app fetches the same catalog entities from Strapi:

 - All options remain strongly typed via shared TS interfaces
 - Assets are delivered by Strapi media
 - Pricing fields can be maintained by non-dev users
 - Redis caching (optional)

# Loading & performance UX

 - Skeleton loaders while fetching catalog data
 - Lazy loaded steps
 - Image lazy loading
