import Dispatcher from '../dispatchers/DatabaseDispatcher';
import { adaptDatabaseError } from '../utils/errors/databaseErrorAdapter';

class UserService {
  static async createUser(tenantId, newUserData) {
    const [err, user] = await Dispatcher.getTenant(tenantId)
      .Users
      .create(newUserData);

    if (err) {
      return [adaptDatabaseError(err, { operation: 'create', resource: 'User' }), null];
    }

    return [null, user];
  }

  static async getUsers(tenantId, { page, limit }) {
    const [err, users] = await Dispatcher.getTenant(tenantId)
      .Users
      .findAll(false, limit, (page - 1) * limit);
    
    if (err || !users) {
      return [adaptDatabaseError(err, { operation: 'read', resource: 'Users' }), null];
    }

    const [countErr, total] = await Dispatcher.getTenant(tenantId)
      .Users
      .count();

    return [null, { users, page, limit, total }];
  }

  static async getUser(tenantId, userId) {
    const [err, user] = await Dispatcher.getTenant(tenantId)
      .Users
      .findById(userId);
    
    if (err || !user) {
      return [adaptDatabaseError(err, { operation: 'read', resource: 'User' }), null];
    }
    
    return [null, user];
  }

  static async updateUser(tenantId, userId, newUserData) {
    const [err, user] = await Dispatcher.getTenant(tenantId)
      .Users
      .update(userId, newUserData);
    
    if (err || !user) {
      return [adaptDatabaseError(err, { operation: 'update', resource: 'User' }), null];
    }
    
    return [null, user];
  }

  static async deleteUser(tenantId, userId) {
    const [err, user] = await Dispatcher.getTenant(tenantId)
      .Users
      .softDelete(userId);
    
    if (err || !user) {
      return [adaptDatabaseError(err, { operation: 'delete', resource: 'User' }), null];
    }

    return [null, true];
  }
}

export default UserService;