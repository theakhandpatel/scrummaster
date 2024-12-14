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

module.exports = {
  DefaultConfig,
  ModelConfig
};
