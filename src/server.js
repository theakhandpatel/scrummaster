const fastify = require('fastify')({ 
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      coerceTypes: true,
      useDefaults: true
    }
  }
});

const { adminPool } = require('./config/database');
const tenantRoutes = require('./routes/tenant.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');
const errorHandler = require('./plugins/errorHandler');
const CacheConfig = require('./config/cache');

// Configure global cache settings
CacheConfig.setGlobalConfig({
  enabled: true,
  ttl: 3600,
  prefix: 'api',
  models: {
    TaskModel: {
      ttl: 1800,
      prefix: 'tasks'
    },
    UserModel: {
      ttl: 3600,
      prefix: 'users'
    },
    CommentModel: {
      ttl: 1800,
      prefix: 'comments'
    }
  }
});

// Register plugins
fastify.register(errorHandler);

// Register routes
fastify.register(tenantRoutes, { prefix: '/api/v1' });
fastify.register(taskRoutes, { prefix: '/api/v1' });
fastify.register(userRoutes, { prefix: '/api/v1' });
fastify.register(commentRoutes, { prefix: '/api/v1' });

// Health check route
fastify.get('/health', async () => ({ status: 'ok' }));

async function start() {
  try {
    await adminPool.query('SELECT NOW()');
    console.log('Successfully connected to admin database');

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();