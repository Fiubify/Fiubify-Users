const firebase = require('firebase-admin/auth');
const User = require('../models/userModel');
const authError = require('../errors/authError');

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
    next(authError.invalidArguments('Invalid arguments passed'));
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
    next(authError.invalidArguments('Invalid arguments passed'));
  }
};

module.exports = {
  createUserWithEmailAndPassword,
  createUserWithProvider,
};
