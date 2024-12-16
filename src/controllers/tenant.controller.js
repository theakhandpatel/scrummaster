const TenantService = require('../services/tenant.service');

async function createTenant(request, reply) {
  try {
    const { name } = request.body;
    const newTenant = await TenantService.createTenant(name);
    reply.code(201).send({
      id: newTenant.id,
      apiKey: newTenant.api_key,
      message: 'Store this API key securely. It will not be shown again.'
    });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
}

module.exports = {
  createTenant
};
