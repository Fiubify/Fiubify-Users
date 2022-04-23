const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/UserControllers');

router.post('/', userControllers.createUserWithEmailAndPassword);
router.get('/', userControllers.getAllUsers);
router.patch('/block/:id', userControllers.blockUser);
router.patch('/unblock/:id', userControllers.unblockUser);

module.exports = router;
