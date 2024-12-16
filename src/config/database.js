const { Pool } = require('pg');

// Admin database connection pool
const adminPool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'admin_db'
});

// Tenant connection pools cache
const tenantPools = new Map();

// Get or create tenant connection pool
async function getTenantPool(tenantId) {
  if (tenantPools.has(tenantId)) {
    return tenantPools.get(tenantId);
  }

  const client = await adminPool.connect();
  try {
    const { rows } = await client.query(
      'SELECT db_name, db_user, db_password FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (rows.length === 0) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const { db_name, db_user, db_password } = rows[0];
    const pool = new Pool({
      user: db_user,
      password: db_password,
      host: 'localhost',
      port: 5432,
      database: db_name
    });

    tenantPools.set(tenantId, pool);
    return pool;
  } finally {
    client.release();
  }
}

module.exports = {
  adminPool,
  getTenantPool
};