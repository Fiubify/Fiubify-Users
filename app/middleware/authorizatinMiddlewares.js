const {
  validateTokenAndRole,
  validateUserId,
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
      next();
    }
  };

  return callback;
};

const protectUrlByUser = async (req, res, next) => {
  const token = req.body.token;
  const userId = req.params.id;

  if (!token) {
    ApiError.badRequest("No token was passed").constructResponse(res);
    return;
  }

  const error = await validateUserId(token, userId);

  if (error) {
    res.status(error.code).json(error.toJson());
    return;
  } else {
    next();
  }
};

module.exports = {
  protectUrlByUser,
  protectUrlByRole,
};
