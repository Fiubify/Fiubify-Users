const { auth: firebaseAuth } = require("../services/firebase");
const User = require("../models/userModel");
const apiError = require("../errors/apiError");
const firebaseError = require("../errors/firebaseError");

const findUserUsingFirebaseToken = async (token) => {
  const firebaseUser = await firebaseAuth.verifyIdToken(token, true);

  const mongooseUser = await User.findOne({
    uid: firebaseUser.uid.toString(),
  });

  return mongooseUser;
};

const validateTokenAndRole = async (token, role) => {
  try {
    const mongooseUser = findUserUsingFirebaseToken(token);

    if (mongooseUser === null) {
      return apiError.resourceNotFound(`User with passed token doesn't exists`);
    }

    if (mongooseUser.role != role) {
      return apiError.forbiddenError(`You need to be a ${role} to access`);
    }
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      return firebaseError.handleError(error, apiError);
    }

    return apiError.internalError(error);
  }
};

const validateUserId = async (token, userId) => {
  try {
    const mongooseUser = findUserUsingFirebaseToken(token);

    if (mongooseUser === null) {
      return apiError.resourceNotFound(`User with passed token doesn't exists`);
    }

    if (mongooseUser.id !== userId) {
      return apiError.forbiddenError(
        `User with id ${mongooseUser.id} doesn't have access to this resource`
      );
    }
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      return firebaseError.handleError(error, apiError);
    }

    return apiError.internalError(error);
  }
};

module.exports = {
  validateTokenAndRole,
  validateUserId,
};
