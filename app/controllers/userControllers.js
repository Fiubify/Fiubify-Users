const firebaseAuth = require("../services/firebase").auth;
const User = require("../models/userModel");
const apiError = require("../errors/apiError");
const QueryParser = require("../utils/QueryParser");

const getAllUsers = async (req, res, next) => {
  const queryParams = ['role'];
  const queryParamsContained = ["name"];
  const queryParser = new QueryParser(queryParams, queryParamsContained);

  const query = queryParser.parseRequest(req);

  try {
    const users = await User.find(query).all();

    if (!users.length && Object.keys(query).length !== 0) {
      const message = queryParser.getErrorMessageNotFound(req);
      next(apiError.resourceNotFound(message));
      return;
    } else {
      res.status(200).json({
        data: users,
      });
    }
  } catch (err) {
    next(apiError.internalError("Internal error when getting songs"));
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
    return;
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

  const userToChangeSubscription = await User.findOne({ uid: userId });
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

const editProfile = async (req, res, next) => {
  const userId = req.params.id;

  const userToChangeProfile = await User.findOne({ uid: userId });
  if (userToChangeProfile === null) {
    next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`));
    return;
  }

  try {
    await userToChangeProfile.updateOne(req.body);

    res.status(204).json({});
  } catch (e) {
    console.log(e);
    next(
      apiError.internalError(
        "Internal error when trying to edit profile"
      )
    );
    return;
  }
}

module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
  getUser,
  changeUserSubscription,
  editProfile
};
