const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/authControllers");

router.post("/register-email", authControllers.createUserWithEmailAndPassword);
router.post("/register-provider", authControllers.createUserWithProvider);
router.post("/validate", authControllers.validateAuth);
router.post("/validate/uid", authControllers.validateUid);
router.post("/validate/admin", authControllers.validateAdmin);
router.post("/validate/user", authControllers.validateUserWithToken);
router.post("/validate/users", authControllers.validateUsersWithToken); // Used for validating multiple ids

module.exports = router;
