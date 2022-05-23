const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");
const {
  protectUrlByUser,
  protectUrlByRole,
} = require("../middleware/authorizatinMiddlewares");

router.get("/", userControllers.getAllUsers);
router.get("/:uid", userControllers.getUser);
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
  "/:id/change-subscription",
  protectUrlByUser,
  userControllers.changeUserSubscription
);

module.exports = router;
