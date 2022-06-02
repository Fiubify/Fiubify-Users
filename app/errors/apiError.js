class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static resourceNotFound(msg) {
    return new ApiError(404, msg);
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static invalidArguments(msg) {
    return new ApiError(400, msg);
  }

  static internalError(msg) {
    return new ApiError(500, msg);
  }

  static authorizationError(msg) {
    return new ApiError(401, msg);
  }

  static forbiddenError(msg) {
    return new ApiError(403, msg);
  }

  toJson() {
    return {
      error: {
        msg: this.message,
      },
    };
  }

  constructResponse(res) {
    res.status(this.code).json(this.toJson());
  }
}

module.exports = ApiError;
