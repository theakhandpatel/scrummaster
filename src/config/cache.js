/**
 * Default cache configuration.
 * @typedef {Object} DefaultConfig
 * @property {boolean} enabled - Whether caching is enabled.
 * @property {number} ttl - Default time-to-live for cache entries (in seconds).
 * @property {string} prefix - Default prefix for cache keys.
 * @property {Object.<string, ModelConfig>} models - Model-specific cache configurations.
 */

/**
 * Model-specific cache configuration.
 * @typedef {Object} ModelConfig
 * @property {boolean} enabled - Whether caching is enabled for the model.
 * @property {number} ttl - Time-to-live for cache entries (in seconds) for the model.
 * @property {string} prefix - Prefix for cache keys for the model.
 */

/**
 * Default cache configuration.
 * @type {DefaultConfig}
 */
const defaultConfig = {
  enabled: true,
  ttl: 3600, // Default 1 hour
  prefix: 'cache',
  models: {
    // Model-specific default configurations
    TaskModel: {
      enabled: true,
      ttl: 1800, // 30 minutes for tasks
      prefix: 'tasks'
    }
  }
};

/**
 * Cache configuration class.
 */
class CacheConfig {
  static config = { ...defaultConfig };

  /**
   * Set global cache configuration.
   * @param {DefaultConfig} newConfig - New global cache configuration.
   */
  static setGlobalConfig(newConfig) {
    this.config = {
      ...defaultConfig,
      ...newConfig,
      models: {
        ...defaultConfig.models,
        ...(newConfig.models || {})
      }
    };
  }

  /**
   * Get model-specific cache configuration.
   * @param {string} modelName - Name of the model.
   * @returns {ModelConfig} Model-specific cache configuration.
   */
  static getModelConfig(modelName) {
    return {
      ...this.config,
      ...(this.config.models[modelName] || {})
    };
  }
}

module.exports = CacheConfig;
