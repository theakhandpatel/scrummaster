const { adminPool, getTenantPool } = require('../config/database');
const TenantContext = require('./TenantContext');

class DatabaseDispatcher {
  constructor() {
    this.tenantContexts = new Map();
  }

  async getTenant(tenantId) {
    if (this.tenantContexts.has(tenantId)) {
      return this.tenantContexts.get(tenantId);
    }

    const pool = await getTenantPool(tenantId);
    const context = new TenantContext(pool, tenantId);
    this.tenantContexts.set(tenantId, context);
    return context;
  }

  // Admin pool operations
  async verifyTenantApiKey(apiKey) {
    const client = await adminPool.connect();
    try {
      const { rows } = await client.query(
        'SELECT id FROM tenants WHERE api_key = $1 AND deleted_at IS NULL',
        [apiKey]
      );
      return rows[0] || null;
    } finally {
      client.release();
    }
  }

  async verifyAdminApiKey(apiKey) {
    return apiKey === process.env.ADMIN_API_KEY;
  }

  // Clear cached contexts (useful for testing or memory management)
  clearCache() {
    this.tenantContexts.clear();
  }
}

// Singleton instance
const dispatcher = new DatabaseDispatcher();
module.exports = dispatcher;