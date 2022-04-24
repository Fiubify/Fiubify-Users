const firebase = require('firebase-admin/auth');
const User = require('../models/userModel');

const firebaseAuth = firebase.getAuth();

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().all();

    res.status(200).json({ data: { users: users } });
  } catch (_) {
    res.status(500).json({ error: { msg: 'Internal Error' } });
  }
};

const blockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const userToBlock = await User.findById(userId);

    await userToBlock.updateOne({ disabled: true });
    await firebaseAuth.updateUser(userToBlock.uid, { disabled: true });

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: { msg: 'Id not found' } });
  }
};

const unblockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const userToUnblock = await User.findById(userId);

    await userToUnblock.updateOne({ disabled: false });
    await firebaseAuth.updateUser(userToUnblock.uid, { disabled: false });

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: { msg: 'Id not found' } });
  }
};

module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
};
