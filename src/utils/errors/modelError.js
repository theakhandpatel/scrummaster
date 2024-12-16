class ModelError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'ModelError';
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends ModelError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 'MODEL_NOT_FOUND');
  }
}

export class DuplicateError extends ModelError {
  constructor(resource = 'Resource') {
    super(`${resource} already exists`, 'MODEL_DUPLICATE');
  }
}

export class ValidationError extends ModelError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 'MODEL_VALIDATION', details);
  }
}

export class DatabaseError extends ModelError {
  constructor(message = 'Database operation failed', details = null) {
    super(message, 'MODEL_DATABASE', details);
  }
}

export class ForeignKeyError extends DatabaseError {
  constructor(message = 'Referenced resource does not exist') {
    super(message, 'MODEL_FOREIGN_KEY');
  }
}

export default {
  ModelError,
  NotFoundError,
  DuplicateError,
  ValidationError,
  DatabaseError,
  ForeignKeyError
};
