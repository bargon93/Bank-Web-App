const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const {body} = require('express-validator');
const { Validate } = require('../model/Validate');

router.post('/', 
body('mail').notEmpty().withMessage("Please enter an Email"), 
body('mail').isEmail().withMessage("Invalid email"), 
body('password').notEmpty().withMessage("Please enter a password") ,
body('first_name').notEmpty().withMessage("Please enter a first name"),
body('last_name').notEmpty().withMessage("Please enter a last name"),
Validate ,
usersController.handleNewUser)


module.exports = router;