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

class CacheConfig {
  static config = { ...defaultConfig };

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

  static getModelConfig(modelName) {
    return {
      ...this.config,
      ...(this.config.models[modelName] || {})
    };
  }
}

module.exports = CacheConfig;