const firebaseAuth = require("../services/firebase").auth;
const User = require("../models/userModel");
const apiError = require("../errors/apiError");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().all();

    res.status(200).json({ data: { users: users } });
  } catch (e) {
    next(apiError.internalError("Internal error"));
    return;
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    if (!userId) next(apiError.resourceNotFound("No hay uid"));
    const user = await User.findOne({ uid: userId });
    if (!user) next(apiError.resourceNotFound("No se encontró el usuario"));

    res.status(200).json(user);
  } catch (e) {
    next(apiError.internalError("Internal error"));
  }
};

const blockUser = async (req, res, next) => {
  const userId = req.params.id;

  const userToBlock = await User.findById(userId);

  if (userToBlock === null) {
    next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`));
    return;
  }

  try {
    await userToBlock.updateOne({ disabled: true });
    await firebaseAuth.updateUser(userToBlock.uid, { disabled: true });

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    next(apiError.internalError("Internal error when trying to block user"));
    return;
  }
};

const unblockUser = async (req, res, next) => {
  const userId = req.params.id;

  const userToUnblock = await User.findById(userId);
  if (userToUnblock === null) {
    next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`));
    return;
  }

  try {
    await userToUnblock.updateOne({ disabled: false });
    await firebaseAuth.updateUser(userToUnblock.uid, { disabled: false });

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    next(apiError.internalError("Internal error when trying to unblock user"));
    return;
  }
};

const changeUserSubscription = async (req, res, next) => {
  const userId = req.params.id;
  const subscriptionType = req.body.plan;

  const userToChangeSubscription = await User.findById(userId);
  if (userToChangeSubscription === null) {
    next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`));
    return;
  }

  if (userToChangeSubscription.plan === subscriptionType) {
    next(
      apiError.invalidArguments(`User already have plan: ${subscriptionType}`)
    );
    return;
  }

  try {
    await userToChangeSubscription.updateOne({ plan: subscriptionType });

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    next(
      apiError.internalError(
        "Internal error when trying to change subscription plan"
      )
    );
    return;
  }
};

module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
  getUser,
  changeUserSubscription,
};
