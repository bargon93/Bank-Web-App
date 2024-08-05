const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const balanceController = require('../controllers/balanceController');

router.get('/', authController.checkAuth, balanceController.handleGetBalance);

module.exports = router;