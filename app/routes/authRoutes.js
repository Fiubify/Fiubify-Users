const express = require('express');
const router = express.Router();

const authEmailController = require('../controllers/authEmailController');

router.post('/register_email', authEmailController.authWithEmailAndPassword);

module.exports = router;
