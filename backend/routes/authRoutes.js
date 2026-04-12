const {register,login,googleLogin} = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
module.exports = router;