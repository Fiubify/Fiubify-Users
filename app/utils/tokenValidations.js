const { auth: firebaseAuth } = require("../services/firebase");
const User = require("../models/userModel");
const apiError = require("../errors/apiError");
const firebaseError = require("../errors/firebaseError");

const validateUidWithFirebaseToken = async (token, uid) => {
  try {
    const firebaseUser = await firebaseAuth.verifyIdToken(token, true);
    if (uid !== firebaseUser.uid.toString()) {
      return apiError.forbiddenError(`User token doesn't belong to sent uid`);
    }
  } catch (e) {
    console.log(e);
    return apiError.invalidArguments(`No valid uid`);
  }
};

const findUserUsingFirebaseToken = async (token) => {
  const firebaseUser = await firebaseAuth.verifyIdToken(token, true);

  const mongooseUser = await User.findOne({
    uid: firebaseUser.uid.toString(),
  });

  return mongooseUser;
};

const validateTokenAndRole = async (token, role) => {
  try {
    const mongooseUser = await findUserUsingFirebaseToken(token);

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
    const mongooseUser = await findUserUsingFirebaseToken(token);

    if (mongooseUser === null) {
      return apiError.resourceNotFound(`User with passed token doesn't exists`);
    }

    if (mongooseUser.uid !== userId) {
      return apiError.forbiddenError(
        `User with uid ${mongooseUser.uid} doesn't have access to this resource`
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

const validateMultipleUsersId = async (token, arrayOfUsersId) => {
  const trueOrFalseArray = arrayOfUsersId.map(async (id) => {
    const result = await validateUserId(token, id);
    if (result) {
      return false;
    }

    return true;
  });

  if (trueOrFalseArray.all((boolean) => boolean === false)) {
    return apiError.forbiddenError(
      `Users with id ${arrayOfUsersId.join(
        ","
      )} doesn't have access to this resource`
    );
  }
};

module.exports = {
  validateUidWithFirebaseToken,
  validateTokenAndRole,
  validateUserId,
  validateMultipleUsersId,
};
