const CacheManager = require('../utils/cacheManager');

class BaseModel {
  constructor(pool, cacheOptions = {}) {
    this.pool = pool;
    this.cache = new CacheManager(this.constructor.name, cacheOptions);
  }

  generateCacheKey(id) {
    return `${this.constructor.name}:${id}`;
  }

  generateListCacheKey(filter = '') {
    return `${this.constructor.name}:list:${filter}`;
  }
}

module.exports = BaseModel;