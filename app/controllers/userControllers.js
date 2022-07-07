const firebaseAuth = require("../services/firebase").auth;
const { getUserWalletBalance, createPayment, createTransaction, createWithdrawal } = require("../services/payments");
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

  try {
    let response = await createPayment(user.walletAddress, premium_plan_cost)
    await user.updateOne({plan: 'Premium'})
    res.status(204).json({})
  } catch (e) {
    console.log(e)
    next(apiError.internalError("Internal error when trying to change subscription plan"))
  }
}

const donateToUser = async (req, res, next) => {
  const fromUserId = req.params.uid
  const fromUser = await User.findOne({ uid: fromUserId })
  if (fromUser === null) {
    next(apiError.resourceNotFound(`User with id ${fromUserId} doesn't exists`))
    return;
  }

  const toUserId = req.body.to_uid
  const toUser = await User.findOne({ uid: toUserId })
  if (toUser === null) {
    next(apiError.resourceNotFound(`User with id ${toUserId} doesn't exists`))
    return;
  }

  const amount = req.body.amount

  try {
    await createTransaction(fromUser.walletAddress,
                            toUser.walletAddress,
                            amount)

    res.status(204).json({})
  } catch (e) {
    console.log(e)
    next(
      apiError.internalError(
        "Internal error when trying to make donation"
      )
    )
  }
}

const withdrawFunds = async (req, res, next) => {
  const userId = req.params.uid
  const user = await User.findOne({ uid: userId })
  if (user === null) {
    next(apiError.resourceNotFound(`User with id ${userId} doesn't exists`))
    return;
  }

  const toAddress = req.body.to_address
  const amount = req.body.amount

  try {
    await createWithdrawal(user.walletAddress, toAddress, amount)
    res.status(204).json({})
  } catch (e) {
    console.log(e)
    next(apiError.internalError("Internal error when trying to withdraw"))
  }
}

module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
  editUserProfile,
  getUser,
  upgradeUserSubscription,
  donateToUser,
};
