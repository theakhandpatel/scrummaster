const { validateTenantApiKey } = require('../middleware/tenantAuth');
const UserController = require('../controllers/user.controller');
const userSchema = require('../schemas/user.schema');

async function userRoutes(fastify) {
  const preHandler = [validateTenantApiKey];

  // User CRUD operations
  fastify.post(
    '/tenants/:tenantId/users',
    { schema: userSchema.create, preHandler },
    UserController.createUser
  );

  fastify.get(
    '/tenants/:tenantId/users',
    { schema: userSchema.list, preHandler },
    UserController.getUsers
  );

  fastify.get(
    '/tenants/:tenantId/users/:userId',
    { schema: userSchema.get, preHandler },
    UserController.getUser
  );

  fastify.put(
    '/tenants/:tenantId/users/:userId',
    { schema: userSchema.update, preHandler },
    UserController.updateUser
  );

  fastify.delete(
    '/tenants/:tenantId/users/:userId',
    { schema: userSchema.delete, preHandler },
    UserController.deleteUser
  );
}

module.exports = userRoutes;