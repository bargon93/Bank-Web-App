const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {body} = require('express-validator');
const { Validate } = require('../model/Validate');

router.post('/', 
body('mail').notEmpty().withMessage("Please enter an Email"),
body('mail').isEmail().withMessage("Invalid email"),
body('password').notEmpty().withMessage("Please enter a password"),
Validate,
authController.handleLogin);

module.exports = router;