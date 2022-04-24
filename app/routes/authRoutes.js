const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register-email', authController.createUserWithEmailAndPassword);
router.post('/register-provider', authController.createUserWithProvider);

module.exports = router;
