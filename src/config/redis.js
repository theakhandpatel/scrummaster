/**
 * Redis configuration.
 * @type {Redis}
 */
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

/**
 * Redis connection error event handler.
 * @param {Error} err - Redis connection error.
 * @returns {void}
 */
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

/**
 * Redis connect event handler.
 * @returns {void}
 */
redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

module.exports = redis;
