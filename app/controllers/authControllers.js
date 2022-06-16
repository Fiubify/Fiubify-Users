const firebaseAuth = require("../services/firebase").auth;
const createUserWallet = require("../services/firebase").auth;
const User = require("../models/userModel");

const apiError = require("../errors/apiError");
const firebaseError = require("../errors/firebaseError");
const {
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

    let userWalletAddress = createUserWallet()

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

    //TODO validate result data
    res
      .status(201)
      .json({ data: { uid: createdUser.uid, id: mongoCreatedUser.id } });
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      next(firebaseError.handleError(error, apiError));
      return;
    }
    //TODO handle mongoose errors
    next(apiError.invalidArguments("Invalid arguments passed"));
    return;
  }
};

const createUserWithProvider = async (req, res, next) => {
  const { email, role, uid } = req.body;

  try {
    const newUser = new User({
      uid: uid,
      email: email,
      role: role,
    });

    const createdUser = await newUser.save();

    //TODO validate result data
    res.status(201).json({ data: { uid: uid, id: createdUser.id } });
  } catch (error) {
    console.log(error);
    if (firebaseError.isAFirebaseError(error)) {
      next(firebaseError.handleError(error, apiError));
      return;
    }
    //TODO handle mongoose errors
    next(apiError.invalidArguments("Invalid arguments passed"));
    return;
  }
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
};
