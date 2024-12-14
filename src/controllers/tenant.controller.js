const TenantService = require('../services/tenant.service');

async function createTenant(request, reply) {
  try {
    const { name } = request.body;
    const tenant = await TenantService.createTenant(name);
    reply.code(201).send({
      id: tenant.id,
      apiKey: tenant.api_key,
      message: 'Store this API key securely. It will not be shown again.'
    });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
}

module.exports = {
  createTenant
};