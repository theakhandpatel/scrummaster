class ResponseFormatter {
  static success(data, message = '') {
    return {
      success: true,
      data,
      message
    };
  }

  static error(message, statusCode = 500) {
    return {
      success: false,
      error: {
        message,
        statusCode
      }
    };
  }

  static paginate(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export default ResponseFormatter;