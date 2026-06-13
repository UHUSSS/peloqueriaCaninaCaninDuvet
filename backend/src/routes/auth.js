const express = require('express');
const router = express.Router();
const c = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

router.post('/login', c.login);
router.get('/me', verifyToken, c.getMe);

module.exports = router;
