const { adminPool } = require('../config/database');
const createError = require('http-errors');

async function validateTenantApiKey(request, reply) {
  const apiKey = request.headers['x-api-key'];
  
  if (!apiKey) {
    throw createError(401, 'API key is required');
  }

  const client = await adminPool.connect();
  try {
    const { rows } = await client.query(
      'SELECT id FROM tenants WHERE api_key = $1 AND deleted_at IS NULL',
      [apiKey]
    );

    if (rows.length === 0) {
      throw createError(401, 'Invalid API key');
    }

    // Verify that the API key belongs to the requested tenant
    const tenantId = parseInt(request.params.tenantId);
    if (tenantId !== rows[0].id) {
      throw createError(403, 'API key does not match tenant');
    }

    request.tenantId = rows[0].id;
  } finally {
    client.release();
  }
}

module.exports = { validateTenantApiKey };