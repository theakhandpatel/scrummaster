import { DatabaseError, NotFoundError, ForeignKeyError, DuplicateError, ValidationError } from '../utils/errors/modelError';

class BaseModel {
  constructor(pool) {
    this.pool = pool;
  }

  handleError(err) {
    switch (err.code) {
      case '23503':
        return new ForeignKeyError();
      case '23505':
        return new DuplicateError();
      default:
        return new DatabaseError(err.message);
    }
  }

  handleNotFound(resource) {
    return new NotFoundError(resource);
  }

  handleValidation(message, details = null) {
    return new ValidationError(message, details);
  }
}

export default BaseModel;