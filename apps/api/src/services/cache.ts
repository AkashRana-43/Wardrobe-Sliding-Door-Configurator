import Redis from 'ioredis';

const CACHE_TTL = 60 * 60; // 1 hour in seconds

let client: Redis | null = null;

/**
 * Returns a singleton Redis client.
 * Falls back gracefully if Redis is unavailable — API still works, just uncached.
 */
const getClient = (): Redis | null => {
  if (client) return client;

  try {
    client = new Redis({
      host: process.env.REDIS_HOST ?? 'redis',
      port: parseInt(process.env.REDIS_PORT ?? '6379'),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });

    client.on('error', (err) => {
      console.warn('[Cache] Redis connection error — running uncached:', err.message);
      client = null;
    });

    return client;
  } catch {
    return null;
  }
};

export const cache = {
  /**
   * Get a cached value by key. Returns null on miss or Redis unavailable.
   */
  async get<T>(key: string): Promise<T | null> {
    const redis = getClient();
    if (!redis) return null;

    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set a value in cache with default TTL.
   */
  async set(key: string, value: unknown, ttl = CACHE_TTL): Promise<void> {
    const redis = getClient();
    if (!redis) return;

    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch {
      // Cache write failure is non-fatal
    }
  },

  /**
   * Invalidate a specific cache key.
   * Called from Strapi lifecycle hooks when content is updated.
   */
  async invalidate(key: string): Promise<void> {
    const redis = getClient();
    if (!redis) return;

    try {
      await redis.del(key);
    } catch {
      // Non-fatal
    }
  },
};