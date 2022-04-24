const firebase = require('firebase-admin/auth');
const User = require('../models/userModel');
const userError = require('../errors/userError');

const firebaseAuth = firebase.getAuth();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().all();

    res.status(200).json({ data: { users: users } });
  } catch (e) {
    next(userError.internalError('Internal error'));
    return;
  }
};

const blockUser = async (req, res, next) => {
  const userId = req.params.id;

  const userToBlock = await User.findById(userId);

  if (userToBlock === null) {
    next(userError.userNotFound(`User with id ${userId} doesn't exists`));
    return;
  }

  try {
    await userToBlock.updateOne({ disabled: true });
    await firebaseAuth.updateUser(userToBlock.uid, { disabled: true });

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    next(userError.internalError('Internal error when trying to block user'));
    return;
  }
};

const unblockUser = async (req, res, next) => {
  const userId = req.params.id;

  const userToUnblock = await User.findById(userId);
  if (userToUnblock === null) {
    next(userError.userNotFound(`User with id ${userId} doesn't exists`));
    return;
  }

  try {
    await userToUnblock.updateOne({ disabled: false });
    await firebaseAuth.updateUser(userToUnblock.uid, { disabled: false });

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    next(userError.internalError('Internal error when trying to unblock user'));
    return;
  }
};
module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
};
