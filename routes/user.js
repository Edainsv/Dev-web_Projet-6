const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const password = require('../middleware/password-config');
const email = require('../middleware/email-config');


router.post('/signup', password, email, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;