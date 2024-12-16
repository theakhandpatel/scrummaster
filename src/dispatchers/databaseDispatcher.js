import { adminPool } from '../config/database';
import TenantContext from './tenantContext';

class DatabaseDispatcher {
  constructor() {
    this.tenantContexts = new Map();
  }

  async getTenant(tenantId) {
    if (this.tenantContexts.has(tenantId)) {
      return this.tenantContexts.get(tenantId);
    }

    const context = await TenantContext.Create(tenantId);
    this.tenantContexts.set(tenantId, context);
    return context;
  }

  // Admin pool operations
  async verifyTenantApiKey(apiKey) {
    const client = await adminPool.connect();
    try {
      const { tenantRows } = await client.query(
        'SELECT id FROM tenants WHERE api_key = $1 AND deleted_at IS NULL',
        [apiKey]
      );
      return tenantRows[0] || null;
    } finally {
      client.release();
    }
  }

  async verifyAdminApiKey(apiKey) {
    return apiKey === process.env.ADMIN_API_KEY;
  }

  clearCache() {
    // Close all pool connections before clearing
    for (const context of this.tenantContexts.values()) {
      context.pool.end();
    }
    this.tenantContexts.clear();
  }
}

// Singleton instance
const dispatcher = new DatabaseDispatcher();
export default dispatcher;