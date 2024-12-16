import { Pool } from 'pg';

// Format and validate environment variables
const databaseConfig = {
  user: process.env.DB_USER?.trim(),
  password: process.env.DB_PASSWORD?.trim(),
  host: process.env.DB_HOST?.trim() || 'localhost',
  port: parseInt(process.env.DB_PORT?.trim() || '5432', 10),
  database: process.env.ADMIN_DB_NAME?.trim()
};

// Validate required config
if (!databaseConfig.user || !databaseConfig.password || !databaseConfig.database) {
  throw new Error('Missing required database configuration environment variables');
}

// Admin database connection pool
const adminPool = new Pool(databaseConfig);

// Create new tenant pool configuration
async function initializeTenantDbPool(tenantId) {
  const client = await adminPool.connect();
  try {
    const { tenantRows } = await client.query(
      'SELECT db_name, db_user, db_password FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (tenantRows.length === 0) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const { db_name, db_user, db_password } = tenantRows[0];
    return new Pool({
      user: db_user,
      password: db_password,
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: db_name
    });
  } finally {
    client.release();
  }
}

export default {
  adminPool,
  initializeTenantDbPool
};
