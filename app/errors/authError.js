const errorInterface = require('./errorInterface');

class ApiAuthError extends errorInterface {
  constructor(code, message) {
    super(code, message);
  }

  static invalidArguments(message) {
    return new ApiAuthError(400, message);
  }

  static internalError(message) {
    return new ApiAuthError(500, message);
  }
}

module.exports = ApiAuthError;
