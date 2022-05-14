const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/authControllers");

router.post("/register-email", authControllers.createUserWithEmailAndPassword);
router.post("/register-provider", authControllers.createUserWithProvider);
router.post("/validate", authControllers.validateAuth);
router.post("/validate/admin", authControllers.validateAdmin);

module.exports = router;
