const errorInterface = require('./errorInterface');

class ApiUserError extends errorInterface {
  constructor(code, message) {
    super(code, message);
  }

  static userNotFound(msg) {
    return new ApiUserError(404, msg);
  }

  static invalidArguments(msg) {
    return new ApiUserError(400, msg);
  }

  static internalError(msg) {
    return new ApiUserError(500, msg);
  }
}

module.exports = ApiUserError;
