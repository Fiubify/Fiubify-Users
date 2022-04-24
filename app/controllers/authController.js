const firebase = require('firebase-admin/auth');
const User = require('../models/userModel');

const apiError = require('../errors/apiError');
const firebaseError = require('../errors/firebaseError');

const firebaseAuth = firebase.getAuth();

const createUserWithEmailAndPassword = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    let createdUser = await firebaseAuth.createUser({
      email: email,
      password: password,
      disabled: false,
    });

    const newUser = new User({
      uid: createdUser.uid,
      email: email,
      role: role,
    });

    const mongoCreatedUser = await newUser.save();

    //TODO validate result data
    res
      .status(201)
      .json({ data: { uid: createdUser.uid, id: mongoCreatedUser.id } });
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      next(firebaseError.handleError(error, apiError));
      return;
    }
    //TODO handle mongoose errors
    next(apiError.invalidArguments('Invalid arguments passed'));
    return;
  }
};

const createUserWithProvider = async (req, res, next) => {
  const { email, role, uid } = req.body;

  try {
    const newUser = new User({
      uid: uid,
      email: email,
      role: role,
    });

    const createdUser = await newUser.save();

    //TODO validate result data
    res.status(201).json({ data: { uid: uid, id: createdUser.id } });
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      next(firebaseError.handleError(error, apiError));
      return;
    }
    //TODO handle mongoose errors
    next(apiError.invalidArguments('Invalid arguments passed'));
    return;
  }
};

const validateAuth = async (req, res, next) => {
  const { token, role } = req.body;
  try {
    const firebaseUser = await firebaseAuth.verifyIdToken(token, true);
    const userUid = firebaseUser.uid.toString();

    const mongooseUser = await User.findOne({
      uid: userUid,
    });

    if (mongooseUser === null) {
      next(
        apiError.resourceNotFound(`User with uid ${userUid} doesn't exists`)
      );
      return;
    }

    if (mongooseUser.role != role) {
      next(apiError.forbiddenError(`You need to be a ${role} to access`));
      return;
    }

    res.status(200).json({});
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      next(firebaseError.handleError(error, apiError));
      return;
    }

    next(apiError.internalError(error));
    return;
  }
};

module.exports = {
  createUserWithEmailAndPassword,
  createUserWithProvider,
  validateAuth,
};
