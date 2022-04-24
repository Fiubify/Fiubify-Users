class FirebaseAuthErrorHandler {
  static isAFirebaseError(errorJson) {
    if ('errorInfo' in errorJson) {
      const errorInfo = errorJson.errorInfo;
      if ('code' in errorInfo && 'message' in errorInfo) {
        return true;
      }
    }

    return false;
  }

  static handleError(errorJson, errorClass) {
    const errorCode = errorJson.code;

    if (errorCode === 'auth/email-already-exists') {
      return new errorClass(400, errorJson.message);
    } else if (errorCode === 'auth/internal-error') {
      return new errorClass(500, 'Internal error');
    } else if (
      errorCode === 'auth/invalid-email' ||
      errorCode === 'auth/invalid-password'
    ) {
      return new errorClass(400, errorJson.message);
    } else if (errorCode === 'auth/invalid-id-token') {
      return new errorClass(401, 'Invalid token');
    } else {
      return new errorClass(500, errorJson.message);
    }
  }
}

module.exports = FirebaseAuthErrorHandler;
