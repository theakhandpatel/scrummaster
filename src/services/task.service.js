import Dispatcher from '../dispatchers/DatabaseDispatcher';
import { adaptDatabaseError } from '../utils/errors/databaseErrorAdapter';


class TaskService {
  static async createTask(tenantId, newTaskData) {
    const [err, task] = await Dispatcher
      .getTenant(tenantId)
      .Tasks
      .create(newTaskData);

    if (err) {
      return [adaptDatabaseError(err, { operation: 'create', resource: 'Task' }), null];
    }

    return [null, task];
  }

  static async getTasks(tenantId, filters = {}) {
    const [err, tasks] = await Dispatcher
      .getTenant(tenantId)
      .Tasks
      .findAll(filters);

    if (err || !tasks) {
      return [adaptDatabaseError(err, { operation: 'read', resource: 'Tasks' }), null];
    }

    return [null, tasks];
  }

  static async getTask(tenantId, taskId) {
    const [err, task] = await Dispatcher
      .getTenant(tenantId)
      .Tasks
      .findById(taskId);

    if (err || !task) {
      return [adaptDatabaseError(err, { operation: 'read', resource: 'Task' }), null];
    }

    return [null, task];
  }

  static async updateTask(tenantId, taskId, newTaskData) {
    const [err, task] = await Dispatcher
      .getTenant(tenantId)
      .Tasks
      .update(taskId, newTaskData);

    if (err || !task) {
      return [adaptDatabaseError(err, { operation: 'update', resource: 'Task' }), null];
    }

    return [null, task];
  }

  static async deleteTask(tenantId, taskId) {
    const [err, task] = await Dispatcher
      .getTenant(tenantId)
      .Tasks
      .softDelete(taskId);

    if (err || !task) {
      return [adaptDatabaseError(err, { operation: 'delete', resource: 'Task' }), null];
    }

    return [null, task];
  }
}

export default TaskService;