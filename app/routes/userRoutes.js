const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.getAllUsers);
router.get("/:uid", userControllers.getUser);
router.patch("/block/:id", userControllers.blockUser);
router.patch("/unblock/:id", userControllers.unblockUser);

module.exports = router;
