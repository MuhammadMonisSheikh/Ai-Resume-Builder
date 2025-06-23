// Network optimization utilities for reducing Firebase requests
// Developed by Monis
// Portfolio: https://portfolio-552de.web.app/
// Feel free to contact for future updates or services.

class NetworkOptimizer {
  constructor() {
    this.cache = new Map();
    this.requestQueue = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.MAX_CACHE_SIZE = 100;
    this.BATCH_DELAY = 50; // 50ms for batching
  }

  // Optimized cached request with faster response times
  async cachedRequest(key, requestFn, options = {}) {
    const {
      forceRefresh = false,
      cacheDuration = this.CACHE_DURATION,
      priority = 'normal'
    } = options;

    // Check cache first (fastest path)
    if (!forceRefresh) {
      const cached = this.cache.get(key);
      if (cached && (Date.now() - cached.timestamp) < cacheDuration) {
        console.log(`Cache hit for: ${key}`);
        return cached.data;
      }
    }

    // Check if request is already in progress
    if (this.requestQueue.has(key)) {
      console.log(`Request already in progress for: ${key}, waiting...`);
      return this.requestQueue.get(key);
    }

    // Create new request promise
    const requestPromise = this.executeRequest(key, requestFn, cacheDuration, priority);
    this.requestQueue.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(key);
    }
  }

  // Optimized request execution
  async executeRequest(key, requestFn, cacheDuration, priority) {
    const startTime = Date.now();
    
    try {
      // Execute the actual request
      const data = await requestFn();
      
      const requestTime = Date.now() - startTime;
      console.log(`Request completed for ${key} in ${requestTime}ms`);

      // Cache the result immediately
      this.setCache(key, data, cacheDuration);
      
      return data;
    } catch (error) {
      const requestTime = Date.now() - startTime;
      console.error(`Request failed for ${key} after ${requestTime}ms:`, error);
      throw error;
    }
  }

  // Optimized cache setting with size management
  setCache(key, data, duration) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration
    });
  }

  // Batch multiple requests for better performance
  async batchRequests(requests) {
    const results = new Map();
    const promises = [];

    requests.forEach(({ key, requestFn, options }) => {
      const promise = this.cachedRequest(key, requestFn, options)
        .then(result => results.set(key, result))
        .catch(error => results.set(key, { error }));
      
      promises.push(promise);
    });

    await Promise.all(promises);
    return results;
  }

  // Preload critical data
  preloadData(keys) {
    keys.forEach(({ key, requestFn, options }) => {
      // Execute in background without waiting
      this.cachedRequest(key, requestFn, { ...options, priority: 'low' })
        .catch(error => console.warn(`Preload failed for ${key}:`, error));
    });
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.duration) {
        this.cache.delete(key);
      }
    }
  }

  // Clear specific cache entry
  clearCache(key) {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAllCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      pendingRequests: this.requestQueue.size
    };
  }

  // Optimize for authentication requests specifically
  async authRequest(key, requestFn) {
    return this.cachedRequest(key, requestFn, {
      cacheDuration: 2 * 60 * 1000, // 2 minutes for auth
      priority: 'high'
    });
  }

  // Optimize for user data requests
  async userDataRequest(key, requestFn) {
    return this.cachedRequest(key, requestFn, {
      cacheDuration: 10 * 60 * 1000, // 10 minutes for user data
      priority: 'normal'
    });
  }
}

// Create singleton instance
const networkOptimizer = new NetworkOptimizer();

// Clean up expired cache entries periodically
setInterval(() => {
  networkOptimizer.clearExpiredCache();
}, 60 * 1000); // Every minute

export default networkOptimizer; 