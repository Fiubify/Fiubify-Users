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

    await newUser.save();

    res.status(200).json({ data: { uid: createdUser.uid, role: role } });
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

    await newUser.save();
    res.status(200).json({ data: { uid: uid, role: role } });
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

module.exports = {
  createUserWithEmailAndPassword,
  createUserWithProvider,
};
