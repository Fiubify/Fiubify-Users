class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  toJson() {
    return {
      error: {
        msg: this.message,
      },
    };
  }
}

module.exports = ApiError;
