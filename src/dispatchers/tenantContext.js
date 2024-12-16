import TaskModel from '../models/task';
import UserModel from '../models/user';
import CommentModel from '../models/comment';
import { initializeTenantDbPool } from '../config/database';

class TenantContext {
  constructor(tenantId, pool) {
    this.tenantId = tenantId;
    this.pool = pool;
    this._initializeModels();
  }

  static async Create(tenantId) {
    const pool = await initializeTenantDbPool(tenantId);
    return new TenantContext(tenantId, pool);
  }

  _initializeModels() {
    this._tasks = new TaskModel(this.pool);
    this._users = new UserModel(this.pool);
    this._comments = new CommentModel(this.pool);
  }

  get Tasks() {
    return this._tasks;
  }

  get Users() {
    return this._users;
  }

  get Comments() {
    return this._comments;
  }
}

export default TenantContext;