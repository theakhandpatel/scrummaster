const TaskModel = require('../models/task');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');

class TenantContext {
  constructor(pool, tenantId) {
    this.pool = pool;
    this.tenantId = tenantId;
    this._initializeModels();
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

module.exports = TenantContext;