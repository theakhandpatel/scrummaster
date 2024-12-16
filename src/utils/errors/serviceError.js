import ModelError from './modelError';

class ServiceError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.details = details;
  }

  static fromModelError(modelError) {
    switch (modelError.code) {
      case 'MODEL_NOT_FOUND':
        return new ResourceNotFoundError(modelError.message);
      case 'MODEL_DUPLICATE':
        return new ResourceAlreadyExistsError(modelError.message);
      case 'MODEL_VALIDATION':
        return new ValidationFailedError(modelError.message, modelError.details);
      case 'MODEL_FOREIGN_KEY':
        return new InvalidReferenceError(modelError.message);
      default:
        return new ServiceError(modelError.message, 'SERVICE_ERROR', modelError);
    }
  }
}

export class ResourceNotFoundError extends ServiceError {
  constructor(resource) {
    super(`${resource}`, 'SERVICE_NOT_FOUND');
  }
}

export class ResourceAlreadyExistsError extends ServiceError {
  constructor(resource) {
    super(`${resource}`, 'SERVICE_DUPLICATE');
  }
}

export class ValidationFailedError extends ServiceError {
  constructor(message, details) {
    super(message, 'SERVICE_VALIDATION', details);
  }
}

export class InvalidReferenceError extends ServiceError {
  constructor(message) {
    super(message, 'SERVICE_INVALID_REFERENCE');
  }
}

export default {
  ServiceError,
  ResourceNotFoundError,
  ResourceAlreadyExistsError,
  ValidationFailedError,
  InvalidReferenceError
};
