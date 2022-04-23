const firebase = require('firebase-admin/auth');
const firebaseAuth = firebase.getAuth();

const authWithEmailAndPassword = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let createdUser = await firebaseAuth.createUser({
      email: email,
      password: password,
      disabled: false,
    });

    console.log(createdUser.uid);
    console.log(role);

    res.status(200).json({ data: { uid: createdUser.uid, role: role } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

module.exports = {
  authWithEmailAndPassword,
};
