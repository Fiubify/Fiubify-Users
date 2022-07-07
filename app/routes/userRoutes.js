const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");
const {
  protectUrlByUser,
  protectUrlByRole,
} = require("../middleware/authorizatinMiddlewares");

router.get("/", userControllers.getAllUsers);
router.get("/:uid", userControllers.getUser);

if (process.env.NODE_ENV === "DEV") {
  router.patch("/:uid", userControllers.editUserProfile);
} else {
  router.patch("/:uid", protectUrlByUser, userControllers.editUserProfile);
}

router.patch(
  "/block/:id",
  protectUrlByRole("Admin"),
  userControllers.blockUser
);
router.patch(
  "/unblock/:id",
  protectUrlByRole("Admin"),
  userControllers.unblockUser
);
router.patch(
  "/:uid/upgrade-subscription",
  protectUrlByUser,
  userControllers.upgradeUserSubscription
);
router.post(
  "/:uid/donate",
  protectUrlByUser,
  userControllers.donateToUser
);
router.post(
  "/:uid/withdraw",
  protectUrlByUser,
  userControllers.withdrawFunds
);

module.exports = router;
