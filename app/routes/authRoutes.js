const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/UserControllers');

router.post('/', userControllers.createUserWithEmailAndPassword);
router.get('/', userControllers.getAllUsers);

module.exports = router;
