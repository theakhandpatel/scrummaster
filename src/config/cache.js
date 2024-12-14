const { DefaultConfig, ModelConfig } = require('../types/common');

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
