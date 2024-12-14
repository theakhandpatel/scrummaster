const { createTenant } = require('../controllers/tenant.controller');

async function tenantRoutes(fastify) {
  fastify.post('/tenants', createTenant);
}

module.exports = tenantRoutes;