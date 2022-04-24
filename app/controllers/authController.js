const firebase = require('firebase-admin/auth');
const User = require('../models/userModel');

const firebaseAuth = firebase.getAuth();

const createUserWithEmailAndPassword = async (req, res) => {
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
    res.status(400).json({ error: error });
  }
};

module.exports = {
  createUserWithEmailAndPassword,
};
