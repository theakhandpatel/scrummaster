import ModelError from './modelError';
import ServiceError from './serviceError';
import ResponseFormatter from '../responseFormatter';

const statusCodeMap = {
  'SERVICE_NOT_FOUND': 404,
  'SERVICE_DUPLICATE': 409,
  'SERVICE_VALIDATION': 400,
  'SERVICE_INVALID_REFERENCE': 400,
  'SERVICE_ERROR': 500
};

function handleModelError(error) {
  if (error instanceof ModelError.ModelError) {
    return ServiceError.fromModelError(error);
  }
  return new ServiceError('Internal server error', 'SERVICE_ERROR', error);
}

function handleServiceError(error, res) {
  const statusCode = statusCodeMap[error.code] || 500;
  const response = ResponseFormatter.error(error.message, statusCode);
  
  if (error.details) {
    response.error.details = error.details;
  }

  return res.status(statusCode).json(response);
}

export {
  handleModelError,
  handleServiceError
};
