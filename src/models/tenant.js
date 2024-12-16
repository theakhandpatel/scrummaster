import { adminPool } from '../config/database';
import { generateApiKey } from '../utils/apiKey';

class TenantModel {
  static async create(name) {
    const client = await adminPool.connect();
    try {
      await client.query('BEGIN');

      const apiKey = generateApiKey();

      // Create tenant record
      const { rows: [tenant] } = await client.query(
        'INSERT INTO tenants (name, db_name, db_user, db_password, api_key) VALUES ($1, $2, $3, $4, $5) RETURNING id, api_key',
        [name, `tenant_${name}`, `user_${name}`, `pass_${name}`, apiKey]
      );

      // Create tenant database
      await client.query(`CREATE DATABASE tenant_${name}`);
      
      // Connect to new tenant database and create tables
      const tenantClient = await adminPool.connect();
      try {
        await tenantClient.query(`
          CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
      } finally {
        tenantClient.release();
      }

      await client.query('COMMIT');
      return tenant;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default TenantModel;