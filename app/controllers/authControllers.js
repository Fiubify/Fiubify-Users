const firebaseAuth = require("../services/firebase").auth;
const { createUserWallet } = require("../services/payments");
const User = require("../models/userModel");

const apiError = require("../errors/apiError");
const firebaseError = require("../errors/firebaseError");
const {
  validateUidWithFirebaseToken,
  validateTokenAndRole,
  validateUserId,
  validateMultipleUsersId,
} = require("../utils/tokenValidations");

const createUserWithEmailAndPassword = async (req, res, next) => {
  const { email, password, role, name, surname, birthdate, plan } = req.body;

  try {
    let createdUser = await firebaseAuth.createUser({
      email: email,
      password: password,
      disabled: false,
    });

    let userWalletAddress = await createUserWallet();

    const newUser = new User({
      uid: createdUser.uid,
      email: email,
      role: role,
      name: name,
      surname: surname,
      birthdate: birthdate,
      plan: plan,
      walletAddress: userWalletAddress,
    });

    const mongoCreatedUser = await newUser.save();

    res
      .status(201)
      .json({ data: { uid: createdUser.uid, id: mongoCreatedUser.id } });
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      next(firebaseError.handleError(error, apiError));
      return;
    }
    next(apiError.invalidArguments("Invalid arguments passed"));
    return;
  }
};

const createUserWithProvider = async (req, res, next) => {
  const { email, uid, role, name, surname, birthdate, plan } = req.body;

  try {
    let userWalletAddress = await createUserWallet();

    const newUser = new User({
      uid: uid,
      email: email,
      role: role,
      name: name,
      surname: surname,
      birthdate: birthdate,
      plan: plan,
      walletAddress: userWalletAddress,
    });

    const mongoCreatedUser = await newUser.save();

    res.status(201).json({ data: { uid: uid, id: mongoCreatedUser.id } });
  } catch (error) {
    console.log(error);
    next(apiError.invalidArguments("Invalid arguments passed"));
    return;
  }
};

const validateUid = async (req, res, next) => {
  const { uid, token } = req.body;
  const error = await validateUidWithFirebaseToken(token, uid);

  if (error) {
    next(error);
    return;
  }

  res.status(200).json({});
};

const validateAuth = async (req, res, next) => {
  const { token, role } = req.body;
  const error = await validateTokenAndRole(token, role);

  if (error) {
    next(error);
    return;
  }

  res.status(200).json({});
};

const validateAdmin = async (req, res, next) => {
  const { token } = req.body;
  const role = "Admin"; // TODO create enum or abstraction for role

  const error = await validateTokenAndRole(token, role);

  if (error) {
    next(error);
    return;
  }

  res.status(200).json({});
};

const validateUserWithToken = async (req, res, next) => {
  const { token, userId } = req.body;

  const error = validateUserId(token, userId);

  if (error) {
    next(error);
    return;
  }

  res.status(200).json({});
};

const validateUsersWithToken = async (req, res, next) => {
  const { token, usersId } = req.body;

  const error = validateMultipleUsersId(token, usersId);

  if (error) {
    next(error);
    return;
  }

  res.status(200).json({});
};

module.exports = {
  createUserWithEmailAndPassword,
  createUserWithProvider,
  validateAuth,
  validateAdmin,
  validateUserWithToken,
  validateUsersWithToken,
  validateUid,
};
