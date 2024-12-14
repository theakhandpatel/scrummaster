const redis = require('../config/redis');
const CacheConfig = require('../config/cache');

class CacheManager {
  constructor(modelName, options = {}) {
    // Get model-specific config and merge with constructor options
    const modelConfig = CacheConfig.getModelConfig(modelName);
    
    this.prefix = options.prefix || modelConfig.prefix;
    this.ttl = options.ttl || modelConfig.ttl;
    this.enabled = options.enabled !== undefined ? options.enabled : modelConfig.enabled;
  }

  generateKey(key) {
    return `${this.prefix}:${key}`;
  }

  async get(key) {
    if (!this.enabled) return null;
    const data = await redis.get(this.generateKey(key));
    return data ? JSON.parse(data) : null;
  }

  async set(key, value) {
    if (!this.enabled) return;
    const cacheKey = this.generateKey(key);
    await redis.set(cacheKey, JSON.stringify(value), 'EX', this.ttl);
  }

  async del(key) {
    if (!this.enabled) return;
    await redis.del(this.generateKey(key));
  }

  async delPattern(pattern) {
    if (!this.enabled) return;
    const keys = await redis.keys(this.generateKey(pattern));
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}

module.exports = CacheManager;