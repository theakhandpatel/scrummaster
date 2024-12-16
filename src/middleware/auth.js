const dispatcher = require('../dispatchers/DatabaseDispatcher');
const createError = require('http-errors');

async function validateApiKey(request, reply) {
  const apiKey = request.headers['x-api-key'];
  
  if (!apiKey) {
    throw createError(401, 'API key is required');
  }

  const isValid = await dispatcher.verifyAdminApiKey(apiKey);
  if (!isValid) {
    throw createError(401, 'Invalid API key');
  }
}

async function validateTenantApiKey(request, reply) {
  const tenantApiKey = request.headers['x-tenant-api-key'];
  
  if (!tenantApiKey) {
    throw createError(401, 'Tenant API key is required');
  }

  const tenant = await dispatcher.verifyTenantApiKey(tenantApiKey);
  if (!tenant) {
    throw createError(401, 'Invalid tenant API key');
  }

  // Verify that the API key belongs to the requested tenant
  const tenantId = parseInt(request.params.tenantId);
  if (tenantId !== tenant.id) {
    throw createError(403, 'API key does not match tenant');
  }

  request.tenantId = tenant.id;
}

module.exports = {
  validateApiKey,
  validateTenantApiKey
};