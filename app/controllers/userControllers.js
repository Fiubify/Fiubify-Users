const firebaseAuth = require("../services/firebase").auth;
const { getUserWalletBalance } = require("../services/payments");
const User = require("../models/userModel");
const apiError = require("../errors/apiError");
const QueryParser = require("../utils/QueryParser");

const highest_plan_tier = 'Premium'
const premium_plan_cost = 0.001

const getAllUsers = async (req, res, next) => {
  const queryParams = ["role", "email"];
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

    if (!userId) next(apiError.invalidArguments("No uid was passed"));
    const user = await User.findOne({ uid: userId });
    if (!user)
      next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`));

    res.status(200).json(user);
  } catch (e) {
    next(
      apiError.internalError(
        "Internal error when trying to get users information"
      )
    );
    return;
  }
};

const editUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    if (!userId) next(apiError.invalidArguments("No uid was passed"));
    const user = await User.findOne({ uid: userId });
    if (!user)
      next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`));

    Object.assign(user, req.body);
    await user.save();

    res.status(204).json();
  } catch (e) {
    console.log(e);
    next(
      apiError.internalError(
        "Internal error when trying to update user information"
      )
    );
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

const upgradeUserSubscription = async (req, res, next) => {
  const userId = req.params.uid
  const user = await User.findOne({ uid: userId });
  if (user === null) {
    next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`))
    return;
  } else if (user.plan === highest_plan_tier) {
    next(apiError.invalidArguments(`User plan already ${highest_plan_tier}`))
    return
  }

  let user_wallet_balance = await getUserWalletBalance(user.walletAddress)
  if (user_wallet_balance >= premium_plan_cost) {
    try {
      await user.updateOne({plan: 'Premium'})
      res.status(204).json({})
    } catch (e) {
      console.log(e)
      next(
        apiError.internalError(
          "Internal error when trying to change subscription plan"
        )
      )
    }
  } else {
    next(apiError.invalidArguments("Insufficient funds"))
  }
}

module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
  editUserProfile,
  getUser,
  upgradeUserSubscription,
};
