const firebase = require('firebase-admin/auth');
const User = require('../models/userModel');

const firebaseAuth = firebase.getAuth();

const authWithEmailAndPassword = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const newUser = new User({
      email: email,
      password: password,
      role: role,
    });

    let createdUser = await firebaseAuth.createUser({
      email: email,
      password: password,
      disabled: false,
    });

    await newUser.save();

    res.status(200).json({ data: { uid: createdUser.uid, role: role } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

module.exports = {
  authWithEmailAndPassword,
};
