const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.post('/', sauceCtrl.sauceCreate);
router.get('/', sauceCtrl.sauceList);

module.exports = router;