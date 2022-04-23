const express = require('express');
const router = express.Router();

const authEmailController = require('../controllers/auth_email_controller');

router.post('/register_email', authEmailController.authWithEmailAndPassword);

module.exports = router;
