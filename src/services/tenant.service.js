const TenantModel = require('../models/tenant');

class TenantService {
  static async createTenant(name) {
    try {
      return await TenantModel.create(name);
    } catch (error) {
      throw new Error(`Failed to create tenant: ${error.message}`);
    }
  }
}

module.exports = TenantService;