const {
  validateTokenAndRole,
  validateUidWithFirebaseToken,
} = require("../utils/tokenValidations");
const ApiError = require("../errors/apiError");

const protectUrlByRole = (role) => {
  const callback = async (req, res, next) => {
    const token = req.body.token;

    if (!token) {
      ApiError.badRequest("No token was passed").constructResponse(res);
      return;
    }

    const error = await validateTokenAndRole(token, role);

    if (error) {
      res.status(error.code).json(error.toJson());
      return;
    } else {
      return next();
    }
  };

  return callback;
};

const protectUrlByUser = async (req, res, next) => {
  const token = req.body.token;
  const userId = req.params.uid;

  if (!token) {
    ApiError.badRequest("No token was passed").constructResponse(res);
    return;
  }

  const error = await validateUidWithFirebaseToken(token, userId);

  if (error) {
    res.status(error.code).json(error.toJson());
    return;
  } else {
    return next();
  }
};

module.exports = {
  protectUrlByUser,
  protectUrlByRole,
};
