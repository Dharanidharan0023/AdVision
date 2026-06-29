const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.get('/verify', authenticateToken, authController.verify);

module.exports = router;
