const express = require('express');
const router = express.Router();
const confirmationController = require('../controllers/confirmationController');
const {body} = require('express-validator');
const {Validate} = require('../model/Validate');

router.post('/',
body('code').notEmpty().withMessage("Please enter a confirmation code"),
Validate,
confirmationController.handleConfirmation);

module.exports = router;