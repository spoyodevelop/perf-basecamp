export const createCacheService = (cacheName: string) => {
  let cache: Cache | null = null;

  const getCache = async (): Promise<Cache> => {
    if (!cache) {
      cache = await caches.open(cacheName);
    }
    return cache;
  };

  return {
    async get<T>(key: string): Promise<T | null> {
      const cacheInstance = await getCache();
      const cachedResponse = await cacheInstance.match(key);
      return cachedResponse ? ((await cachedResponse.json()) as T) : null;
    },

    async set(key: string, data: any): Promise<void> {
      const cacheInstance = await getCache();
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cacheInstance.put(key, response);
    }
  };
};
